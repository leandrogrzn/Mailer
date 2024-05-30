import express from 'express'
import path from 'path'
import Mailjet from 'node-mailjet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())

app.use(express.static('app'))

const sendEmail = async (req, res, constantes) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.api_key,
      apiSecret: process.env.api_secret,
    });
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "hekoej@gmail.com",
            Name: "leandro",
          },
          To: [
            {
              Email: constantes.to,
              Name: "garzon",
            },
          ],
          Subject: constantes.subject,
          HTMLPart: constantes.html,
        },
      ],
    });
    res.sendStatus(204)
    console.log("Mail sent correctly!")
  } catch (error) {
    console.log(error.originalMessage)
    res.status(400).send(error.originalMessage)
  }
};

app.get('/', (req, res) => {
  res.sendFile(`${path.resolve()}/index.html`)
})

app.post('/send', async (req, res) => {
  const {to, subject, html } = req.body
  const msg = {
    to,
    subject,
    html
  }
  sendEmail(req, res, msg)
})

app.listen(3000, () => console.log('la app está corriendo'))
