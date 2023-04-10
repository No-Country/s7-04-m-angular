import nodeMailer from "nodemailer";

export class EmailService {

    public async sendEmail(email: string , subject: string, message: string) {
        const config = {
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.NODEMAILER_MAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        };

        const mail = {
            From: process.env.NODEMAILER_MAIL,
            to: email,
            subject,
            html: message,
        };

        const transport = nodeMailer.createTransport(config);
        await transport.sendMail(mail);
    }

    public async sendEmailRegister(email: string, id: number, token: string) {
        const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/validateAccount/${id}/${token}`;
        const subject: string = "Activate Account";
        const message: string = `
        <div>
        <p>Active account</p>
        <a href=${url}>Validate</a>
        </div>`;
        await this.sendEmail(email, subject, message);
    }

    public async sendEmailForgetPassword(email: string, id: number, token: string) {
        const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/changePassword/${id}/${token}`;
        const subject: string = "Change Password";
        const message: string = `
        <div>
        <p>Change password</p>
        <a href=${url}>Change</a>
        </div>`;
        await this.sendEmail(email, subject, message);
    }

}