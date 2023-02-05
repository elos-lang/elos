"use strict";

import nodemailer from 'nodemailer';
import fs from "fs";

async function main() {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'durward87@ethereal.email',
            pass: 'qNpxCPKn37Jk7Jcku7'
        }
    });

    const html = fs.readFileSync('./example/test.html', 'utf8');

    const info = await transporter.sendMail({
        from: '"Rein Van Oyen" <foo@example.com>',
        to: "foo@example.com, baz@example.com", // list of receivers
        subject: "Elos test", // Subject line
        text: "Elos test", // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
