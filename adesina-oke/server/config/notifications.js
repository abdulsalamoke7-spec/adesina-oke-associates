const { Resend } = require('resend');
const axios = require('axios');

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email ────────────────────────────────────────────────────────────────────

/**
 * Sends an email notification to the firm when a new meeting is booked.
 */
async function notifyFirmOfBooking(meeting) {
  const subject = `New Consultation Request — ${meeting.firstName} ${meeting.lastName}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; color: #1A1208;">
      <h2 style="color: #B8963E;">New Consultation Request</h2>
      <table style="width:100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #666; width: 140px;">Client</td>
            <td><strong>${meeting.firstName} ${meeting.lastName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td>
            <td>${meeting.email}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td>
            <td>${meeting.phone}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Date</td>
            <td>${meeting.date}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Time</td>
            <td>${meeting.time}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Practice Area</td>
            <td>${meeting.area}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Matter</td>
            <td>${meeting.matter || '—'}</td></tr>
      </table>
      <p style="margin-top: 24px; font-size: 13px; color: #999;">
        Log in to the admin dashboard to confirm or reschedule.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.FIRM_EMAIL,
      subject,
      html,
    });
    console.log('📧 Firm notification email sent');
  } catch (err) {
    // Non-fatal — log and continue
    console.error('Email send failed:', err.message);
  }
}

/**
 * Sends a confirmation email to the client after booking.
 */
async function confirmClientEmail(meeting) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; color: #1A1208;">
      <h2 style="color: #B8963E;">Adesina Oke & Associates</h2>
      <p>Dear ${meeting.firstName},</p>
      <p>Thank you for reaching out. We have received your consultation request and will confirm your appointment shortly.</p>
      <table style="width:100%; border-collapse: collapse; font-size: 14px; margin: 20px 0;">
        <tr><td style="padding: 6px 0; color: #666; width: 120px;">Date</td>
            <td><strong>${meeting.date}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Time</td>
            <td><strong>${meeting.time}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Area</td>
            <td>${meeting.area}</td></tr>
      </table>
      <p>All consultations are treated with the strictest confidentiality.</p>
      <p style="color: #B8963E; font-style: italic;">Adesina Oke & Associates</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: meeting.email,
      subject: 'Consultation Request Received — Adesina Oke & Associates',
      html,
    });
    console.log('📧 Client confirmation email sent');
  } catch (err) {
    console.error('Client email failed:', err.message);
  }
}

/**
 * Sends a status update email to the client (confirmed / cancelled).
 */
async function notifyClientOfStatus(meeting) {
  const isConfirmed = meeting.status === 'confirmed';
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; color: #1A1208;">
      <h2 style="color: #B8963E;">Adesina Oke & Associates</h2>
      <p>Dear ${meeting.firstName},</p>
      ${isConfirmed
        ? `<p>Your consultation on <strong>${meeting.date} at ${meeting.time}</strong> has been <strong>confirmed</strong>. We look forward to meeting with you.</p>`
        : `<p>We regret to inform you that your consultation on <strong>${meeting.date} at ${meeting.time}</strong> has been <strong>cancelled</strong>. Please contact us to reschedule at your convenience.</p>`
      }
      <p style="color: #B8963E; font-style: italic;">Adesina Oke & Associates</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: meeting.email,
      subject: `Your Consultation has been ${isConfirmed ? 'Confirmed' : 'Cancelled'} — Adesina Oke & Associates`,
      html,
    });
    console.log(`📧 Status email sent (${meeting.status})`);
  } catch (err) {
    console.error('Status email failed:', err.message);
  }
}

// ── SMS (Termii) ─────────────────────────────────────────────────────────────

/**
 * Sends an SMS to the firm's phone number via Termii.
 */
async function smsFirmOfBooking(meeting) {
  const message = `New booking: ${meeting.firstName} ${meeting.lastName} on ${meeting.date} at ${meeting.time}. Area: ${meeting.area}. Check dashboard.`;

  try {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: process.env.FIRM_PHONE,
      from: process.env.TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY,
    });
    console.log('📱 Firm SMS sent');
  } catch (err) {
    console.error('SMS send failed:', err.message);
  }
}

/**
 * Sends an SMS to the client when their meeting is confirmed or cancelled.
 */
async function smsClientOfStatus(meeting) {
  const isConfirmed = meeting.status === 'confirmed';
  const message = isConfirmed
    ? `Hello ${meeting.firstName}, your consultation with Adesina Oke & Associates on ${meeting.date} at ${meeting.time} is CONFIRMED. We look forward to meeting you.`
    : `Hello ${meeting.firstName}, your consultation on ${meeting.date} at ${meeting.time} has been CANCELLED. Please contact us to reschedule.`;

  try {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: meeting.phone,
      from: process.env.TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY,
    });
    console.log(`📱 Client SMS sent (${meeting.status})`);
  } catch (err) {
    console.error('Client SMS failed:', err.message);
  }
}

module.exports = {
  notifyFirmOfBooking,
  confirmClientEmail,
  notifyClientOfStatus,
  smsFirmOfBooking,
  smsClientOfStatus,
};
