import nodemailer, { Transporter } from 'nodemailer';

// Validate environment variables
if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
  throw new Error('Missing SMTP configuration in environment variables');
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendApprovalEmail = async (
  email: string,
  slotNumber: string,
  plateNumber: string,
): Promise<'success' | 'failed'> => {
  try {
    const info = await transporter.sendMail({
      from: `"Parking System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Parking Slot Request Approved',
      text: `Your request has been approved. Assigned slot: ${slotNumber}, Vehicle: ${plateNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Slot Request Approved</h2>
          <p>Your parking slot request has been approved!</p>
          <ul>
            <li><strong>Slot Number:</strong> ${slotNumber}</li>
            <li><strong>Vehicle:</strong> ${plateNumber}</li>
          </ul>
          <p style="color: #666;">Thank you for using our parking system.</p>
        </div>
      `,
    });
    console.log(
      `Approval email sent to ${email}: Slot ${slotNumber}, Vehicle ${plateNumber}, MessageID: ${info.messageId}`
    );
    return 'success';
  } catch (error) {
    console.error(`Error sending approval email to ${email}:`, error);
    return 'failed';
  }
};

export const sendRejectionEmail = async (email: string, reason: string): Promise<string> => {
  try {
    await transporter.sendMail({
      from: `"Parking System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Parking Slot Request Rejected',
      text: `Your request was rejected. Reason: ${reason}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Slot Request Rejected</h2>
          <p>Your parking slot request has been rejected.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p style="color: #666;">Please contact support if you have any questions.</p>
        </div>
      `,
    });
    console.log(`Sending rejection email to ${email}: ${reason}`);
    return 'success';
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return 'failed';
  }
};

export const sendOtpEmail = async (to: string, otp: string): Promise<string> => {
  try {
    await transporter.sendMail({
      from: `"Parking System" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p>Your OTP code is <strong>${otp}</strong>.</p>
          <p>It expires in 10 minutes.</p>
          <p style="color: #666;">Thank you for using our parking system.</p>
        </div>
      `,
    });
    console.log(`OTP email sent to ${to}`);
    return 'sent';
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
    return 'failed';
  }
};

export const sendExitEmail = async (
  email: string,
  slotNumber: string,
  plateNumber: string,
  startTime: Date,
  endTime: Date,
  cost: number
): Promise<'success' | 'failed'> => {
  try {
    await transporter.sendMail({
      from: `"Parking System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Parking Session Ended - Payment Due',
      text: `Your parking session has ended.\nSlot: ${slotNumber}\nVehicle: ${plateNumber}\nStart: ${startTime.toLocaleString()}\nEnd: ${endTime.toLocaleString()}\nTotal Due: ${cost} FRW`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Parking Session Ended</h2>
          <p>Your parking session has ended. Here are your details:</p>
          <ul>
            <li><strong>Slot Number:</strong> ${slotNumber}</li>
            <li><strong>Vehicle:</strong> ${plateNumber}</li>
            <li><strong>Start Time:</strong> ${startTime.toLocaleString()}</li>
            <li><strong>End Time:</strong> ${endTime.toLocaleString()}</li>
            <li><strong>Total Due:</strong> ${cost} FRW</li>
          </ul>
          <p style="color: #666;">Thank you for using our parking system.</p>
        </div>
      `,
    });
    return 'success';
  } catch (error) {
    console.error(`Error sending exit email to ${email}:`, error);
    return 'failed';
  }
};