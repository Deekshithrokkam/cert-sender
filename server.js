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
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: `Advanced Tech Club <${process.env.EMAIL}>`,
      to: email,
      subject: "🎓 Your Certificate of Completion",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding:20px;">
        <h2>🎉 Congratulations, ${name}!</h2>
        <p>You have successfully completed the workshop.</p>
        <p>Your certificate is attached.</p>
        <br>
        <b>Advanced Tech Club</b>
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

    // ensure arrays
    const emailList = Array.isArray(emails) ? emails : [emails];

    if (!emailList.length || !files.length) {
      return res.status(400).send("❌ Missing data");
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    for (let i = 0; i < emailList.length; i++) {
      if (!files[i]) continue; // safety

      await transporter.sendMail({
        from: `Advanced Tech Club <${process.env.EMAIL}>`,
        to: emailList[i],
        subject: "🎓 Your Certificate",
        html: `
          <div style="font-family: Arial;">
            <h3>🎉 Congratulations!</h3>
            <p>Your certificate is attached.</p>
          </div>
        `,
        attachments: [
          {
            filename: files[i].originalname,
            path: files[i].path
          }
        ]
      });
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
