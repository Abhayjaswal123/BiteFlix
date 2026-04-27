export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const getOtpHtml = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
      }

      .container {
        width: 100%;
        padding: 20px;
      }

      .card {
        max-width: 500px;
        margin: auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
      }

      .title {
        color: #333;
      }

      .text {
        color: #555;
        font-size: 14px;
      }

      .otp-box {
        margin: 20px auto;
        padding: 15px 25px;
        font-size: 24px;
        letter-spacing: 5px;
        font-weight: bold;
        color: #2563EB;
        background: #f1f5ff;
        display: inline-block;
        border-radius: 8px;
      }

      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #aaa;
      }

      .small-text {
        color: #777;
        font-size: 13px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        
        <h2 class="title">Verify Your Email</h2>

        <p class="text">
          Use the OTP below to complete your verification process.
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <div class="otp-box">
          ${otp}
        </div>

        <p class="small-text">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p class="footer">
          © ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>

      </div>
    </div>
  </body>
  </html>
  `;
};