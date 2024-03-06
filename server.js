import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { HarmBlockThreshold, HarmCategory , GoogleGenerativeAI } from '@google/generative-ai';
const PORT = process.env.PORT || 3000

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
    try {
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
      const model = genAI.getGenerativeModel({model: "gemini-pro",safetySettings});
      const req_history = req.body.history;
      const msg = req.body.message;
      if(msg == null){
        return res.status(400).json({
          message:"Not question"
        })
      }
      if(req_history == null){
        const result = await model.generateContent(msg);
        const response = await result.response;
        const text = response.text();
        console.log("Text = "+ text)
        return res.status(200).json({message: text});
      }
      const chat = model.startChat({
        history: req_history,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      const result = await chat.sendMessage(msg);
      const response = await result.response;
      const text = response.text();
      return res.status(200).send({message: text});
    }catch(error){
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        error: error.message
      });
    }
})


app.listen(PORT, () => console.log('AI server started on http://localhost:3000'))