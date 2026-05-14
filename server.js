const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// File upload setup
const upload = multer({ dest: "uploads/" });

/* =========================
   SINGLE EMAIL ROUTE
========================= */
app.post("/send", upload.single("file"), async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name || "Participant";
    const file = req.file;

    if (!email || !file) {
      return res.status(400).send("❌ Missing email or file");
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    await transporter.sendMail({
      from: `Advanced Tech Club <${process.env.EMAIL}>`,
      to: email,
      subject: "🎓 Your Certificate of Completion",
      html: `
<div style="background:#f4f6f8; padding:30px; font-family: 'Segoe UI', Arial, sans-serif;">

  <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <h2 style="color:#1e293b; margin-bottom:15px;">
      🎉 Congratulations, ${name || "Participant"}!
    </h2>

    <p style="color:#475569; font-size:15px; line-height:1.6;">
      You have successfully completed the workshop conducted by 
      <b>Advanced Tech Club NIAT X CDU</b>.
    </p>

    <p style="color:#475569; font-size:15px; line-height:1.6;">
      Your dedication and participation are truly appreciated. Please find your certificate attached with this email.
    </p>

    <div style="margin:25px 0; padding:15px; background:#e2e8f0; border-left:4px solid #22c55e; border-radius:6px;">
      <p style="margin:0; font-size:14px; color:#334155;">
        🚀 Keep learning, keep building, and keep pushing your limits.
      </p>
    </div>

    <p style="color:#475569; font-size:15px;">
      We look forward to seeing you in our upcoming events.
    </p>

    <br>

    <p style="margin:0; color:#475569;">Warm regards,</p>
    <p style="margin:0; font-weight:bold; color:#1e293b;">
      Adv Tech Club
    </p>

    <hr style="margin:25px 0; border:none; border-top:1px solid #e5e7eb;">

    <p style="text-align:center; font-size:13px; color:#94a3b8;">
      See you in the upcoming workshops 🚀
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
    });

    res.send("✅ Email sent successfully!");

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error sending email");
  }
});


/* =========================
   BULK EMAIL ROUTE
========================= */
app.post("/send-bulk", upload.array("files"), async (req, res) => {
  try {
    const emails = req.body.emails;
    const files = req.files;

    const emailList = Array.isArray(emails) ? emails : [emails];

    if (!emailList.length || !files.length) {
      return res.status(400).send("❌ Missing data");
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    for (let i = 0; i < emailList.length; i++) {
      if (!files[i]) continue;

      await transporter.sendMail({
        from: `Advanced Tech Club <${process.env.EMAIL}>`,
        to: emailList[i],
        subject: "🎓 Your Certificate",
        html: `
<div style="background:#f4f6f8; padding:30px; font-family: 'Segoe UI', Arial, sans-serif;">

  <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <h2 style="color:#1e293b; margin-bottom:15px;">
      🎉 Congratulations!
    </h2>

    <p style="color:#475569; font-size:15px; line-height:1.6;">
      You have successfully completed the workshop conducted by 
      <b>Advanced Tech Club NIAT X CDU</b>.
    </p>

    <p style="color:#475569; font-size:15px; line-height:1.6;">
      Your dedication and participation are truly appreciated. Please find your certificate attached with this email.
    </p>

    <div style="margin:25px 0; padding:15px; background:#e2e8f0; border-left:4px solid #22c55e; border-radius:6px;">
      <p style="margin:0; font-size:14px; color:#334155;">
        🚀 Keep learning, keep building, and keep pushing your limits.
      </p>
    </div>

    <p style="color:#475569; font-size:15px;">
      We look forward to seeing you in our upcoming events.
    </p>

    <br>

    <p style="margin:0; color:#475569;">Warm regards,</p>
    <p style="margin:0; font-weight:bold; color:#1e293b;">
      Adv Tech Club
    </p>

    <hr style="margin:25px 0; border:none; border-top:1px solid #e5e7eb;">

    <p style="text-align:center; font-size:13px; color:#94a3b8;">
      See you in the upcoming workshops 🚀
    </p>

  </div>
</div>
`,
        attachments: [
          {
            filename: files[i].originalname,
            path: files[i].path
          }
        ]
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    res.send("✅ All emails sent successfully!");

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error sending bulk emails");
  }
});


/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running..."));
