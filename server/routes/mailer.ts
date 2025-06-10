import express from "express";
import { MailerController } from "../controllers/mailer";
const route = express.Router();
const mailController = new MailerController();

route.post("/sendMail", mailController.sendMail);

export default route