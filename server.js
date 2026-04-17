const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Route to send email
app.post("/send", upload.single("file"), async (req, res) => {
  const email = req.body.email;
  const name = req.body.name || "Participant"; // default if no name
  const file = req.file;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || "advancedtechclub.niatxcdu@gmail.com",
      pass: process.env.PASS || "twbxzgyulnsahhjz"
    }
  });

  let mailOptions = {
    from: "Advanced Tech Club <advancedtechclub.niatxcdu@gmail.com>",
    to: email,
    subject: "🎓 Your Certificate of Completion",
    
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background:#f4f6f8; padding:30px;">
      
      <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px; box-shadow:0 5px 15px rgba(0,0,0,0.08);">
        
        <h2 style="color:#2c3e50; margin-bottom:10px;">🎉 Congratulations, ${name}!</h2>
        
        <p style="font-size:15px; color:#555;">
          You have successfully completed the workshop conducted by <b>Advanced Tech Club NIAT X CDU</b>.
        </p>
        
        <p style="font-size:15px; color:#555;">
          Your dedication and participation are truly appreciated. Please find your certificate attached with this email.
        </p>

        <div style="margin:25px 0; padding:15px; background:#f1f8ff; border-left:4px solid #4CAF50;">
          <p style="margin:0; font-size:14px;">
            🚀 Keep learning, keep building, and keep pushing your limits.
          </p>
        </div>

        <p style="font-size:15px; color:#555;">
          We look forward to seeing you in our upcoming events.
        </p>

        <br>

        <p style="margin:0;">Warm regards,</p>
        <p style="margin:0;"><b>Adv Tech Club</b></p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

        <p style="font-size:12px; color:gray; text-align:center;">
          See you in the upcoming workshops🚀
        </p>

      </div>
    </div>
    `,

    attachments: [
      {
        filename: file.originalname,
        path: file.path
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Email sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error sending email");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running..."));