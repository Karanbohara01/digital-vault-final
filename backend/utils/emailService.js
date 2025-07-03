

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let subject, html;

    // --- LOGIC TO CHOOSE THE CORRECT EMAIL TEMPLATE ---
    if (options.template === 'emailVerification') {
        subject = 'Verify Your Email Address for Digital Vault';
        html = `
            <div style="font-family: Arial, sans-serif; ...">
                <div style="background-color: #1f2937; ..."><h1>📦 Digital Vault</h1></div>
                <div style="padding: 30px;">
                    <h2 style="font-size: 20px;">Please Verify Your Email</h2>
                    <p>Welcome! Please click the button below to verify your email address and activate your account.</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${options.verificationURL}" target="_blank" style="background-color: #28a745; ...">
                            Verify Email Address
                        </a>
                    </p>
                    <p>This link is valid for a limited time. If you did not create this account, please ignore this email.</p>
                </div>
            </div>
        `;
    } else { // Default to password reset
        subject = 'Your Digital Vault Password Reset Token (valid for 10 min)';
        html = `
            <div style="font-family: Arial, sans-serif; ...">
                 <div style="background-color: #1f2937; ..."><h1>📦 Digital Vault</h1></div>
                <div style="padding: 30px;">
                    <h2 style="font-size: 20px;">Password Reset Request</h2>
                    <p>You recently requested to reset your password. Please click the button below to proceed.</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${options.resetURL}" target="_blank" style="background-color: #3b82f6; ...">
                            Reset Your Password
                        </a>
                    </p>
                    <p>This link is valid for the next 10 minutes.</p>
                </div>
            </div>
        `;
    }
    // I've shortened the HTML for brevity, but you can copy your full styled versions.

    const mailOptions = {
        from: 'Digital Vault <hello@vault.com>',
        to: options.email,
        subject: subject,
        html: html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;