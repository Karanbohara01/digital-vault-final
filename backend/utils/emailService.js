

// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     let subject, html;

//     // --- LOGIC TO CHOOSE THE CORRECT EMAIL TEMPLATE ---
//     if (options.template === 'emailVerification') {
//         subject = 'Verify Your Email Address for Digital Vault';
//         html = `
//             <div style="font-family: Arial, sans-serif; ...">
//                 <div style="background-color: #1f2937; ..."><h1>📦 Digital Vault</h1></div>
//                 <div style="padding: 30px;">
//                     <h2 style="font-size: 20px;">Please Verify Your Email</h2>
//                     <p>Welcome! Please click the button below to verify your email address and activate your account.</p>
//                     <p style="text-align: center; margin: 30px 0;">
//                         <a href="${options.verificationURL}" target="_blank" style="background-color: #28a745; ...">
//                             Verify Email Address
//                         </a>
//                     </p>
//                     <p>This link is valid for a limited time. If you did not create this account, please ignore this email.</p>
//                 </div>
//             </div>
//         `;
//     } else { // Default to password reset
//         subject = 'Your Digital Vault Password Reset Token (valid for 10 min)';
//         html = `
//             <div style="font-family: Arial, sans-serif; ...">
//                  <div style="background-color: #1f2937; ..."><h1>📦 Digital Vault</h1></div>
//                 <div style="padding: 30px;">
//                     <h2 style="font-size: 20px;">Password Reset Request</h2>
//                     <p>You recently requested to reset your password. Please click the button below to proceed.</p>
//                     <p style="text-align: center; margin: 30px 0;">
//                         <a href="${options.resetURL}" target="_blank" style="background-color: #3b82f6; ...">
//                             Reset Your Password
//                         </a>
//                     </p>
//                     <p>This link is valid for the next 10 minutes.</p>
//                 </div>
//             </div>
//         `;
//     }
//     // I've shortened the HTML for brevity, but you can copy your full styled versions.

//     const mailOptions = {
//         from: 'Digital Vault <hello@vault.com>',
//         to: options.email,
//         subject: subject,
//         html: html,
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

// backend/utils/emailService.js (Upgraded with Professional HTML Templates)

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter using your .env credentials
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
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">📦 Digital Vault</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6; color: #333;">
                <h2 style="font-size: 20px; color: #1f2937;">Please Verify Your Email</h2>
                <p>Welcome to Digital Vault! We're excited to have you. Please click the button below to verify your email address and activate your account.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${options.verificationURL}" target="_blank" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Verify Email Address
                    </a>
                </p>
                <p>If you did not create this account, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Thank you,<br/>The Digital Vault Team</p>
            </div>
        </div>
        `;
    } else { // Default to the password reset template
        subject = 'Your Digital Vault Password Reset Request';
        html = `
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">📦 Digital Vault</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6; color: #333;">
                <h2 style="font-size: 20px; color: #1f2937;">Password Reset Request</h2>
                <p>You recently requested to reset your password for your Digital Vault account. Please click the button below to proceed.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${options.resetURL}" target="_blank" style="background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Reset Your Password
                    </a>
                </p>
                <p>This password reset link is only valid for the next 10 minutes.</p>
                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Thank you,<br/>The Digital Vault Team</p>
            </div>
        </div>
        `;
    }

    // Define the final mail options
    const mailOptions = {
        from: 'Digital Vault <no-reply@digitalvault.com>',
        to: options.email,
        subject: subject,
        html: html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;