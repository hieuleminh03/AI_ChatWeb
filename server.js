import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Hello there!'
    })
  })

app.post('/', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const req_history = req.body.history;
    const msg = req.body.message;

    const chat = model.startChat({
        history: req_history,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return res.status(200).send({ message: text });
})

app.listen(3000, () => console.log('AI server started on http://localhost:3000'))