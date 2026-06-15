import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import { calculateUrgency } from './src/utils/urgencyScorer.js'
import { analyzeSentiment } from './src/utils/sentimentAnalyzer.js'
import { getRecommendedAction, getDepartment, getSolutionReference } from './src/utils/templates.js'

dotenv.config({ path: '.env.local' })
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

let groqClient = null
function getGroqClient() {
  if (groqClient) return groqClient

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY
  if (!apiKey) return null

  groqClient = new Groq({
    apiKey,
    dangerouslyAllowBrowser: false
  })

  return groqClient
}

function fallbackCategorization(message) {
  const lowerMessage = message.toLowerCase()
  let category = 'General Inquiry'
  let confidence = 0.5
  let reasoning = 'General customer message requiring support team review.'

  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || lowerMessage.includes('charge') || lowerMessage.includes('invoice') || lowerMessage.includes('credit card') || lowerMessage.includes('subscription') || lowerMessage.includes('refund')) {
    category = 'Billing Issue'
    confidence = 0.9
    reasoning = 'Message contains billing-related keywords indicating a payment or invoice concern.'
  } else if ((lowerMessage.includes('bug') || lowerMessage.includes('crash') || lowerMessage.includes('error')) && message.length > 50) {
    category = 'Bug Report'
    confidence = 0.85
    reasoning = 'Detailed message describing a specific bug or system error requiring engineering attention.'
  } else if (lowerMessage.includes('broken') || lowerMessage.includes('not working') || lowerMessage.includes('down') || lowerMessage.includes('loading') || lowerMessage.includes('slow') || lowerMessage.includes('problem')) {
    category = 'Technical Problem'
    confidence = 0.8
    reasoning = 'Message indicates a technical issue with system functionality or performance.'
  } else if (lowerMessage.includes('account') || lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('access')) {
    category = 'Account Issue'
    confidence = 0.85
    reasoning = 'Message relates to account access, authentication, or account management.'
  } else if (lowerMessage.includes('feature') || lowerMessage.includes('add') || lowerMessage.includes('improve') || lowerMessage.includes('would like') || lowerMessage.includes('suggestion') || lowerMessage.includes('could you add')) {
    category = 'Feature Request'
    confidence = 0.8
    reasoning = 'Customer is requesting a new feature or enhancement to the product.'
  } else if ((lowerMessage.includes('thank') || lowerMessage.includes('appreciate') || lowerMessage.includes('great')) && message.length < 100) {
    category = 'Feedback'
    confidence = 0.75
    reasoning = 'Positive feedback or appreciation message from customer.'
  } else if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('when') || lowerMessage.includes('where') || lowerMessage.includes('can i') || lowerMessage.includes('is there')) {
    category = 'General Inquiry'
    confidence = 0.7
    reasoning = 'Customer is asking a general question about the product or service.'
  }

  return { category, confidence, reasoning }
}

async function classifyMessage(message) {
  const client = getGroqClient()
  if (!client) return fallbackCategorization(message)

  const systemPrompt = `You are an expert customer support triage specialist. Analyze the customer message and categorize it.

Available categories:
- Billing Issue: Payment, invoice, charges, refunds, subscriptions
- Technical Problem: Bugs, errors, crashes, system issues, functionality problems
- Account Issue: Account access, password, profile, account management
- Bug Report: Specific bug reports with reproduction steps
- Feature Request: Requests for new features or enhancements
- General Inquiry: Questions about products/services, general help
- Feedback: User feedback, suggestions, compliments

Respond ONLY with a JSON object like this:
{
  "category": "Category Name",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this category was chosen"
}`

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Categorize this customer support message:\n\n"${message}"` }
      ],
      temperature: 0.3,
      max_tokens: 300
    })

    const text = response.choices?.[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        category: parsed.category || 'Unknown',
        confidence: parsed.confidence || 0.7,
        reasoning: parsed.reasoning || text
      }
    }

    return fallbackCategorization(message)
  } catch (error) {
    console.warn('Groq classification failed:', error.message || error)
    return fallbackCategorization(message)
  }
}

app.post('/api/analyze', async (req, res) => {
  const { message } = req.body
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid message payload' })
  }

  try {
    const { category, confidence, reasoning } = await classifyMessage(message)
    const urgency = calculateUrgency(message)
    const sentiment = analyzeSentiment(message)
    const recommendedAction = getRecommendedAction(category, urgency)
    const department = getDepartment(category)
    const solutionReference = getSolutionReference(category)

    return res.json({
      message,
      category,
      confidence,
      reasoning,
      urgency,
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      sentimentConfidence: sentiment.confidence,
      recommendedAction,
      department,
      solutionReference,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Server analysis failed:', error)
    return res.status(500).json({ message: 'Failed to analyze message' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

app.listen(port, () => {
  console.log(`AI backend API listening on http://localhost:${port}`)
})
