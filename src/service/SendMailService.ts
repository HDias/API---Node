import fs from "fs";
import handebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

class SendMailService {
    private client: Transporter;

    constructor(){
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }

    async execute({from, to, subject, text}, variablesTemplate: Object, path: string){
        
        const templateFileContent = fs.readFileSync(path).toString("utf8");
        
        const mailTemplateParse = handebars.compile(templateFileContent);

        const htmlTemplate = mailTemplateParse(variablesTemplate)

        const responseMailSend = await this.client.sendMail({
            to,
            subject,
            html: htmlTemplate,
            from
        });

        console.log('Message sent: %s', responseMailSend.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(responseMailSend));
    }
}

export default new SendMailService();
