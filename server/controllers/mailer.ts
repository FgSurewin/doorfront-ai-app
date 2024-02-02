import { Request, Response, NextFunction } from "express";
import { MailerService } from "../services/mailer";
import { SendMailBody } from "../types/mailer";

const mailerService = new MailerService();

export class MailerController {
  async sendMail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body:SendMailBody = req.body;
    await mailerService.sendMail({ req, res, next },body);
  }
}
