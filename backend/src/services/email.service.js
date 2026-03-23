import config from "../config/config.js";
import MailTranspoter from "../config/mail.js";


export const sendVerificationEmail = async (email, name, verifyLink) => {
    
    const html = `
    <div style="font-family: Arial; padding:20px">
      
      <h2>Welcome ${name} 👋</h2>
  
      <p>Thank you for registering. Please verify your account to continue.</p>
  
      <a href="${verifyLink}" 
         style="
         display:inline-block;
         padding:12px 24px;
         background:#4CAF50;
         color:white;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;
         ">
         Verify Account
      </a>
  
      <p style="margin-top:5px">
        ${verifyLink}
      </p>
      <p style="margin-top:20px">
        If you did not create this account, please ignore this email.
      </p>
  
    </div>
    `;

    await MailTranspoter.sendMail({
        from: `${config.MAIL_EMAIL}`,
        to: email,
        subject: "Verify your account",
        html
    });
};