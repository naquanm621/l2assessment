import Groq from 'groq-sdk';

/**
 * LLM Helper for categorizing customer support messages
 * Using Groq API for AI-powered categorization
 */

// Initialize Groq client - lazy load to handle missing API key
let groq = null;

function getGroqClient() {
  if (groq) return groq;
  
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured. Please add VITE_GROQ_API_KEY to your .env.local file');
  }
  
  groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for browser-based calls (not recommended for production!)
  });
  
  return groq;
}

/**
 * Categorize a customer support message using Groq AI
 * 
 * @param {string} message - The customer support message
 * @returns {Promise<{category: string, reasoning: string, confidence: number}>}
 */
export async function categorizeMessage(message) {
  try {
    const client = getGroqClient();
    
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
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Categorize this customer support message:\n\n"${message}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          category: parsed.category || "Unknown",
          reasoning: parsed.reasoning || content,
          confidence: parsed.confidence || 0.7
        };
      }
    } catch (e) {
      // JSON parse failed, use fallback categorization
    }
    
    // Fallback pattern matching if JSON parsing fails
    return getMockCategorization(message);
  } catch (error) {
    console.warn('Groq API failed, using mock response:', error.message);
    return getMockCategorization(message);
  }
}

/**
 * Mock categorization for when API is unavailable
 */
function getMockCategorization(message) {
  const lowerMessage = message.toLowerCase();
  let category = "General Inquiry";
  let confidence = 0.5;
  let reasoning = "";

  // Billing issue detection
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || 
      lowerMessage.includes('charge') || lowerMessage.includes('invoice') ||
      lowerMessage.includes('credit card') || lowerMessage.includes('subscription') ||
      lowerMessage.includes('refund')) {
    category = "Billing Issue";
    confidence = 0.9;
    reasoning = "Message contains billing-related keywords indicating a payment or invoice concern.";
  }
  
  // Bug report detection (more specific than technical problem)
  else if ((lowerMessage.includes('bug') || lowerMessage.includes('crash') || lowerMessage.includes('error')) &&
           message.length > 50) {
    category = "Bug Report";
    confidence = 0.85;
    reasoning = "Detailed message describing a specific bug or system error requiring engineering attention.";
  }
  
  // Technical problem detection
  else if (lowerMessage.includes('broken') || lowerMessage.includes('not working') ||
      lowerMessage.includes('down') || lowerMessage.includes('loading') ||
      lowerMessage.includes('slow') || lowerMessage.includes('problem')) {
    category = "Technical Problem";
    confidence = 0.8;
    reasoning = "Message indicates a technical issue with system functionality or performance.";
  }

  // Account issue detection
  else if (lowerMessage.includes('account') || lowerMessage.includes('password') || 
           lowerMessage.includes('login') || lowerMessage.includes('access')) {
    category = "Account Issue";
    confidence = 0.85;
    reasoning = "Message relates to account access, authentication, or account management.";
  }
  
  // Feature request detection
  else if (lowerMessage.includes('feature') || lowerMessage.includes('add') ||
      lowerMessage.includes('improve') || lowerMessage.includes('would like') ||
      lowerMessage.includes('suggestion') || lowerMessage.includes('could you add')) {
    category = "Feature Request";
    confidence = 0.8;
    reasoning = "Customer is requesting a new feature or enhancement to the product.";
  }

  // Feedback detection
  else if ((lowerMessage.includes('thank') || lowerMessage.includes('appreciate') || lowerMessage.includes('great')) &&
      message.length < 100) {
    category = "Feedback";
    confidence = 0.75;
    reasoning = "Positive feedback or appreciation message from customer.";
  }
  
  // Question detection
  else if (lowerMessage.includes('how') || lowerMessage.includes('what') || 
      lowerMessage.includes('when') || lowerMessage.includes('where') ||
      lowerMessage.includes('can i') || lowerMessage.includes('is there')) {
    category = "General Inquiry";
    confidence = 0.7;
    reasoning = "Customer is asking a general question about the product or service.";
  }
  
  // Default
  else {
    category = "General Inquiry";
    confidence = 0.5;
    reasoning = "General customer message requiring support team review.";
  }

  return {
    category,
    confidence,
    reasoning
  };
}
