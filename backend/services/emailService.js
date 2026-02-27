const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

// Only create transporter when all required SMTP credentials are present.
const transporter = smtpConfigured
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    })
    : null;

const getFromAddress = () => {
    const fromName = process.env.SMTP_FROM_NAME || 'DYNDOX';
    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;
    return `"${fromName}" <${fromEmail}>`;
};

const sendWaitlistConfirmation = async (email, name) => {
    if (!smtpConfigured || !transporter) {
        console.warn('SMTP not fully configured. Skipping waitlist confirmation email.');
        return;
    }

    const mailOptions = {
        from: getFromAddress(),
        to: email,
        subject: "Welcome to the Launch Pad Waitlist! 🚀",
        html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #000; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; margin: 0;">DYNDOX</h2>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Launch Pad</p>
                </div>
                
                <h1 style="font-size: 32px; font-weight: 700; line-height: 1.2; margin-bottom: 24px;">Hi ${name || 'Founder'},</h1>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                    Welcome to the inner circle. We've officially added you to the <strong>DYNDOX Launch Pad</strong> waitlist.
                </p>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                    <p style="font-size: 15px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">What happens next?</p>
                    <ul style="padding-left: 20px; color: #4b5563; line-height: 1.5; margin: 0;">
                        <li style="margin-bottom: 8px;">You'll receive early access to our private beta.</li>
                        <li style="margin-bottom: 8px;">Exclusive insights into the AI Executive Board.</li>
                        <li>Founder-only resources delivered to your inbox.</li>
                    </ul>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
                    We're building the future of founder productivity, and we're glad to have you on the journey. Stay tuned for updates.
                </p>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 32px; text-align: center;">
                    <p style="font-size: 14px; color: #9ca3af; margin: 0;">
                        &copy; 2024 DYNDOX AI. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

const sendAdminNotification = async (type, data) => {
    if (!smtpConfigured || !transporter) {
        return;
    }

    const mailOptions = {
        from: getFromAddress(),
        to: process.env.ADMIN_EMAIL || smtpUser,
        subject: `New ${type}: ${data.name || data.organisation_name}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>New ${type} received</h2>
                <pre style="background: #f4f4f4; padding: 15px;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Admin notification failed:', error);
    }
};

module.exports = {
    sendWaitlistConfirmation,
    sendAdminNotification
};
