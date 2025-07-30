const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Setup transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REPORT_EMAIL,
        pass: process.env.REPORT_EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.REPORT_EMAIL,
      to,
      subject,
      text: message,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Report email sent successfully." });
  } catch (error) {
    console.error("Failed to send report email:", error);
    res.status(500).json({ error: "Failed to send report email." });
  }
});

module.exports = router;
