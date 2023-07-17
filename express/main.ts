import dotenv from 'dotenv-safe'
import express, { Request, Response } from 'express'

import { ChatGPTAPIBrowser } from '../src'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const email = process.env.OPENAI_EMAIL
const password = process.env.OPENAI_PASSWORD
app.use(express.json())

const initChatGPT = async (): Promise<ChatGPTAPIBrowser> => {
  console.log('initChatGPT::starting..')
  const api = new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: true
  })
  await api.initSession()
  console.log('initChatGPT::done..')
  return api
}

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.post('/chatgpt/', async (req: Request, res: Response) => {
  const { conversationId } = req.query
  const { message, parentMessageId } = req.body
  console.log('express::chatgpt', conversationId, parentMessageId, message)
  try {
    const response = await chatGPTApi.sendMessage(message, {
      conversationId,
      parentMessageId
    })
    return res.status(200).json({
      response
    })
  } catch (error) {
    return res.status(403).json({
      error
    })
  }
})

app.post('/chatgpt/first', async (req: Request, res: Response) => {
  const { message } = req.body
  console.log('express::chatgpt first', message)

  try {
    const response = await chatGPTApi.sendMessage(message)
    return res.status(200).json({
      response
    })
  } catch (error) {
    return res.status(403).json({
      error
    })
  }
})

let chatGPTApi: ChatGPTAPIBrowser | null = null
app.listen(port, async () => {
  chatGPTApi = await initChatGPT()
  console.log(`App listening on port ${port}`)
})
