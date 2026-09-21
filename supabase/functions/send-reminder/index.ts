import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TERMII_API_KEY = Deno.env.get('TERMII_API_KEY')
const TERMII_SENDER_ID = Deno.env.get('TERMII_SENDER_ID') || 'CareSlot'

serve(async (req) => {
  try {
    const payload = await req.json()
    // Payload from Postgres Trigger (Webhook)
    const record = payload.record

    if (!record || !record.patient_id || !record.slot_id) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    // Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch patient phone and slot details
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(record.patient_id)
    if (userError || !userData.user.phone) throw new Error('User phone not found')

    const { data: slotData, error: slotError } = await supabase
      .from('appointment_slots')
      .select('date, start_time, doctors(name, hospitals(name))')
      .eq('id', record.slot_id)
      .single()
    
    if (slotError || !slotData) throw new Error('Slot details not found')

    const hospitalName = slotData.doctors.hospitals.name;
    const doctorName = slotData.doctors.name;
    const date = slotData.date;
    const time = slotData.start_time;
    const phone = userData.user.phone;

    let message = '';
    // If we trigger this on insert, it's a booking confirmation
    if (payload.type === 'INSERT') {
      message = `CareSlot: Your appt at ${hospitalName} with ${doctorName} is confirmed for ${date} at ${time}. Reply to cancel.`;
    } else {
      // Logic for 24h / 2h reminders (would normally be triggered by pg_cron calling this endpoint with a different payload)
      message = `CareSlot Reminder: You have an appt at ${hospitalName} with ${doctorName} tomorrow at ${time}.`;
    }

    // Mock Termii SMS API Call
    console.log(`[MOCK] Sending SMS to ${phone}: ${message}`);
    
    /* Real Termii Implementation:
    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        from: TERMII_SENDER_ID,
        sms: message,
        type: "plain",
        api_key: TERMII_API_KEY,
        channel: "generic"
      })
    });
    */

    // Log the reminder in DB
    await supabase.from('reminders_log').insert({
      appointment_id: record.id,
      reminder_type: payload.type === 'INSERT' ? 'booking' : '24h',
      status: 'sent'
    });

    return new Response(JSON.stringify({ success: true, message: 'Reminder sent' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})

