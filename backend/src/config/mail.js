import nodemailer from 'nodemailer'
import config from './config.js';
const MailTranspoter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
    },
});

MailTranspoter.verify()
    .then(() => { console.log("Email transporter is ready to send emails"); })
    .catch((err) => { console.error("Email transporter verification failed:", err); });

export default MailTranspoter;