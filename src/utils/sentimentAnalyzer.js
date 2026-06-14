/**
 * Sentiment Analyzer - Determines emotional tone of messages
 */

export function analyzeSentiment(message) {
  const lowerMessage = message.toLowerCase();
  let sentimentScore = 0;
  let confidence = 0.5;

  // Positive indicators
  const positiveWords = [
    'thank', 'thanks', 'appreciate', 'appreciate', 'grateful', 'happy', 'love', 
    'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'perfect', 
    'awesome', 'best', 'good', 'nice', 'please', 'kindly', 'help', 'support'
  ];

  // Negative indicators
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 'furious', 
    'upset', 'frustrated', 'annoyed', 'issue', 'problem', 'error', 'bug', 
    'broken', 'crash', 'fail', 'failed', 'not working', 'doesn\'t work',
    'urgent', 'asap', 'immediately', 'critical', 'emergency', 'help', 'stuck'
  ];

  // Calculate positive sentiment
  positiveWords.forEach(word => {
    if (lowerMessage.includes(word)) {
      sentimentScore += 1;
      confidence += 0.1;
    }
  });

  // Calculate negative sentiment
  negativeWords.forEach(word => {
    if (lowerMessage.includes(word)) {
      sentimentScore -= 1.5; // Weight negative words more
      confidence += 0.1;
    }
  });

  // Exclamation marks add weight
  const exclamations = (message.match(/!/g) || []).length;
  if (exclamations > 0) {
    sentimentScore += exclamations * 0.3;
  }

  // Question marks suggest inquiry
  if (message.includes('?')) {
    sentimentScore -= 0.2;
  }

  // All caps (if long enough)
  if (message.length > 20 && message === message.toUpperCase()) {
    sentimentScore -= 0.5; // Could be shouting
  }

  confidence = Math.min(confidence, 0.95);

  if (sentimentScore > 0.5) {
    return { sentiment: 'Positive', score: sentimentScore, confidence };
  } else if (sentimentScore < -0.5) {
    return { sentiment: 'Negative', score: sentimentScore, confidence };
  }
  return { sentiment: 'Neutral', score: sentimentScore, confidence };
}

/**
 * Get sentiment color for UI
 */
export function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'Positive':
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    case 'Negative':
      return 'bg-red-100 text-red-900 border-red-300';
    default:
      return 'bg-slate-100 text-slate-900 border-slate-300';
  }
}
