import { Response } from 'express'
import nodemailer from 'nodemailer'
import { SMTP_EMAIL, SMTP_PASSWORD } from './secrets'

type emailData = {
  email: string
  subject: string
  html: string
}

export const sendEmail = async (emailData: emailData) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    })

    // get email options from params
    const mailOptions = {
      from: SMTP_EMAIL, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    }

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Message sent: %s', info.response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
