import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';
import { createRequire } from 'module';

//const resend = new Resend(process.env.RESEND_API_KEY);
//const require = createRequire(import.meta.url);
//const sslRootCas = require('ssl-root-cas').create();
//https.globalAgent.options.ca = sslRootCas;
dotenv.config();

export async function enviarEmailRecuperacao(emailUsuario, nomeUsuario) {
    const codigoRecuperacao = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            'nome_usuario': nomeUsuario,
            'codigo_recuperacao': codigoRecuperacao,
            'email_to': emailUsuario
        }
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
        //console.log('✅ E-mail enviado com sucesso via EmailJS!');
        //return { sucesso: true };
        return codigoRecuperacao;
    } catch (error) {
        console.error('❌ Erro ao enviar via EmailJS:', error.response ? error.response.data : error.message);
        return { sucesso: false, erro: error.message };
    }




    /*const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        debug: true,
        logger: true
    });

    const mailOptions = {
        from: '"Sistema Madrugada Caçambas" <seu-email@gmail.com>',
        to: emailUsuario,
        subject: "Código de Recuperação de Senha",
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #007bff;">Recuperação de Senha</h2>
                <p>Use o código abaixo para prosseguir:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #28a745; margin: 20px 0;">
                    ${codigoRecuperacao}
                </div>
                <p style="font-size: 12px; color: #777;">Expira em 5 minutos.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return codigoRecuperacao; 
    } catch (error) {
        console.error("Erro no serviço de e-mail:", error);
        throw new Error("Não foi possível enviar o e-mail.");
    }*/
}