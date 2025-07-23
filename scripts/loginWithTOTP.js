const axios = require('axios');
const { authenticator } = require('otplib');
require('dotenv').config();

const email = process.env.CSDX_EMAIL;
const password = process.env.CSDX_PASSWORD;
const secret = process.env.CSDX_TOTP_SECRET;

if (!process.env.CSDX_EMAIL || !process.env.CSDX_PASSWORD || !process.env.CSDX_TOTP_SECRET) {
  console.error("❌ Missing required environment variables.")
  console.log("🔍 Set them via .env for local or GitHub Secrets for CI.")
  process.exit(1)
}

const otp = authenticator.generate(secret);
console.log('🔐 Generated OTP:', otp);

async function login() {
  try {
    const response = await axios.post(
      'https://api.contentstack.io/user-session',
      {
        user: {
          email,
          password,
          otp,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const token = response.data.user.authtoken;
    console.log('✅ Login successful!');
    console.log('🔑 Token:', token);
  } catch (err) {
    console.error('❌ Login failed');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

login();