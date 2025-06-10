import { baseRequest } from ".";
export interface SendMailBody{
  recipient:string,
  subject:string,
  html:string,
}

export const sendMail = (data:SendMailBody) =>
  baseRequest
    .request<any>({
      method: "POST",
      url: `/mailer/sendMail`,
      data
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
