import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { HarmBlockThreshold, HarmCategory , GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config()

const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY

const genAI = new GoogleGenerativeAI(API_KEY);

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
      const model = genAI.getGenerativeModel({model: "gemini-pro"});

      const req_history = req.body.history;
      const msg = req.body.message;
      if(msg == null){
        res.status(400).send({message: "Message is required"})
      }
      if(req_history == null || req_history.length == 0){
        console.log("this is a new conversation");
        const result = await model.generateContent(msg);
        const response = await result.response;
        const text = response.text();
        res.status(200).send({message: text});
        return;
      }
      console.log("this is a continuation of a conversation: ")
      // print out the history
        console.log("history: ");
        for(var i = 0; i < req_history.length; i++){
          console.log(req_history[i].role + ": " + req_history[i].parts);
        }
      const chat = model.startChat({
        history: req_history
      });
      const result = await chat.sendMessage(msg);
      const response = await result.response;
      const text = response.text();
      (text != "") ? res.status(200).send({message: text}): res.status(200).send({message: "No response found"});
    } catch(error) {
        console.log("error = "+ error);
        res.status(500).send({message: "Có lỗi rùi bạn ơi, F5 lại thử xem sao nào!"})
    }
})

app.listen(PORT, () => console.log('AI server started on http://localhost:3000'));