// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables for this script

async function testEmailConnection() {
    console.log('--- Email Connection Test ---');
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`User: ${process.env.EMAIL_USER}`);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log('\nVerifying connection to Mailtrap...');
        await transporter.verify();
        console.log('\n✅ SUCCESS: Connection to Mailtrap is working perfectly!');

    } catch (error) {
        console.error('\n❌ ERROR: Could not connect to Mailtrap.');
        console.error('This might be due to incorrect .env variables or a network/firewall issue.');
        console.error('Original Error:', error);
    }
}

testEmailConnection();