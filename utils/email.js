const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text');
// new Email(user, url).sendWelcom

module.exports = class Email {
   constructor(user, url) {
      this.to = user.email
      this.firstName = user.name.split(' ')[0]
      this.url = url
      this.from = `idrees <${process.env.EMAIL_FROM}>`
   }

   newTransport() {
      if (process.env.NODE_ENV === 'production') {
         // // Sendgrid
         // return nodemailer.createTransport({
         //    service: 'sendgrid',
         //    auth: {
         //       user: process.env.EMAIL_USERNAME,
         //       pass: process.env.EMAIL_PASSWORD,
         //    }
         // })
         // mailgun
         return nodemailer.createTransport({
            service: 'mailgun',
            auth: {
               user: process.env.MAILGUN_KEY,
               pass: process.env.MAILGUN_DOMAIN,
            }
         })
      }
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
         },
      })
   }

   async send(template, subject) {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
         firstName: this.firstName,
         url: this.url,
         subject
      })

      // 2) Defined email options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: htmlToText.fromString(html)
      }
      // 3) Create transporter and send email
      await this.newTransport().sendMail(mailOptions)
   }

   async sendWelcome() {
      await this.send('welcome', 'Welcome to the natours Family!!!')
   }
   async sendPasswordReset() {
      await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
   }
}

// const sendEmail = async options => {
//    // 1) Create a transporter
//    const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//          user: process.env.EMAIL_USERNAME,
//          pass: process.env.EMAIL_PASSWORD,
//       },
//       //Activate in gmail "less secure app"
//    })
//    // 2) Define email options
//    const mailOptions = {
//       from: 'testUser2 <testuser2@gmail.com>',
//       to: options.email,
//       subject: options.subject,
//       text: options.message
//    }
//    // 3) Actually send email
//    await transporter.sendMail(mailOptions)
//    // console.log("Transporter is working")
// }
// module.exports = sendEmail;