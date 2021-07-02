import * as nodemailer from "nodemailer";
import Mail = require("nodemailer/lib/mailer");

export const sendEmail = async (mailOptions: Mail.Options) => {
    let account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    const info = await transporter.sendMail(mailOptions);

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}