import { AppContext,} from "../types";
import * as nodemailer from "nodemailer"
import { SendMailBody } from "../types/mailer";

export class MailerService{
  async sendMail(ctx: AppContext, body: SendMailBody){
    const { res } = ctx;
    const {recipient,subject,html} = body;
    try{

    const account = {
      user: "doorfront.info@gmail.com",
      clientId: process.env.OAUTH2_CLIENTID,
      clientSecret: process.env.OAUTH2_CLIENTSECRET,
      refreshToken: process.env.OAUTH2_REFRESHTOKEN,
      accessToken: process.env.OAUTH2_ACCESSTOKEN
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
        auth: {
          type:"OAuth2",
          user: account.user,
          clientId: account.clientId,
          clientSecret: account.clientSecret,
          refreshToken: account.refreshToken,
          accessToken:account.accessToken
        }
      });

      transporter.on("token", (token) => {
        console.log("A new access token was generated");
        console.log("User: %s", token.user);
        console.log("Access Token: %s", token.accessToken);
        console.log("Expires: %s", new Date(token.expires));
      });

      transporter.sendMail({
        from:"Doorfront <doorfront.info@gmail.com>",
        to:recipient,
        subject:subject,
        html:html,
      }, 
      function(error,info){
        transporter.close()
        if(error)
        res.json({
          code: 500,
          message: "Mail failed",
          data: {error:error, recipient: recipient},
        });
        else res.json({
          code: 0,
          message: "Mail Success",
          data: info,
        });
        
      })
    }
    catch(e){
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }
}