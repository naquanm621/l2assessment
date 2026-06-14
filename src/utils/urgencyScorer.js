/**
 * Urgency Scorer - Enhanced rule-based urgency calculation
 */

export function calculateUrgency(message) {
  let urgencyScore = 50;
  const lowerMessage = message.toLowerCase();

  // Critical keyword indicators
  const criticalKeywords = [
    'urgent', 'asap', 'immediately', 'critical', 'emergency', 
    'down', 'crash', 'broken', 'not working', 'doesn\'t work',
    'stuck', 'blocked', 'can\'t', 'cannot', 'unable'
  ];
  
  criticalKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      urgencyScore += 25;
    }
  });

  // Emotional intensity indicators
  const exclamationCount = (message.match(/!/g) || []).length;
  urgencyScore += exclamationCount * 20;

  // Message length analysis
  if (message.length > 150) urgencyScore += 10; // Detailed problem = more urgent
  if (message.length < 30) urgencyScore -= 15; // Brief = less detailed

  // All caps detection (shouting)
  if (message === message.toUpperCase() && message.length > 10) {
    urgencyScore += 15;
  }

  // Polite/calm language (indicates patience)
  const politeWords = ['please', 'thank', 'thanks', 'appreciate', 'kindly', 'could', 'would'];
  politeWords.forEach(word => {
    if (lowerMessage.includes(word)) urgencyScore -= 10;
  });

  // Question marks (inquiry, not emergency)
  const questionCount = (message.match(/\?/g) || []).length;
  urgencyScore -= questionCount * 5;

  // Positive sentiment reduces urgency
  const positiveWords = ['happy', 'love', 'great', 'excellent', 'wonderful', 'awesome', 'best'];
  positiveWords.forEach(word => {
    if (lowerMessage.includes(word)) urgencyScore -= 15;
  });

  // Time-based factors
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  // After hours boost urgency slightly
  if (hour < 8 || hour > 18) urgencyScore += 5;
  if (day === 0 || day === 6) urgencyScore -= 5; // Weekend = less urgent

  // Clamp score between 0 and 100
  urgencyScore = Math.max(0, Math.min(100, urgencyScore));

  if (urgencyScore > 70) return "High";
  if (urgencyScore > 40) return "Medium";
  return "Low";
}

/**
 * Get urgency color for UI
 */
export function getUrgencyColor(urgency) {
  switch (urgency) {
    case 'High':
      return 'bg-red-100 text-red-900 border-red-300';
    case 'Medium':
      return 'bg-amber-100 text-amber-900 border-amber-300';
    case 'Low':
      return 'bg-green-100 text-green-900 border-green-300';
    default:
      return 'bg-gray-100 text-gray-900 border-gray-300';
  }
}
