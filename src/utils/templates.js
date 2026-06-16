/**
 * Recommendation Templates - Maps categories to recommended actions
 */

const actionTemplates = {
  "Billing Issue": {
    action: "Direct to Billing Department",
    details: "Route to billing team. Verify account status and review recent charges. May require payment plan or adjustment.",
    priority: "high",
    supportTitle: "Billing support guide",
    supportUrl: "/support/billing-issue",
    supportSteps: [
      "Confirm customer billing details and recent transactions.",
      "Validate payment method and invoice status.",
      "Offer account balance updates or payment plan options.",
      "Escalate to billing specialist if charge disputes remain."
    ]
  },
  "Technical Problem": {
    action: "Escalate to Technical Support",
    details: "Escalate to technical team. Gather system logs and reproduction steps. May require remote access or detailed debugging.",
    priority: "high",
    supportTitle: "Technical troubleshooting guide",
    supportUrl: "/support/technical-problem",
    supportSteps: [
      "Collect device, browser, and error context from the user.",
      "Check for system status alerts or known outages.",
      "Reproduce the issue with the same workflow if possible.",
      "Escalate to engineering with logs and reproduction steps."
    ]
  },
  "General Inquiry": {
    action: "Provide FAQ Resources",
    details: "Check FAQ database and knowledge base. If not found, escalate to support team. Provide helpful links and documentation.",
    priority: "low",
    supportTitle: "General support resources",
    supportUrl: "/support/general-inquiry",
    supportSteps: [
      "Search the knowledge base for related help articles.",
      "Share quick answers and documentation links.",
      "Note any follow-up questions for the support team.",
      "Escalate only when an article does not resolve the issue."
    ]
  },
  "Feature Request": {
    action: "Log for Product Team",
    details: "Document feature request and send to product team. Acknowledge user interest and provide timeline if available.",
    priority: "low",
    supportTitle: "Feature request process",
    supportUrl: "/support/feature-request",
    supportSteps: [
      "Capture the requested capability and customer benefit.",
      "Add the request to the product feedback queue.",
      "Inform the customer that the feature is under review.",
      "Track the request and update stakeholders on status."
    ]
  },
  "Bug Report": {
    action: "Escalate to Development",
    details: "Route to engineering team. Request minimal reproduction steps and system details. May need emergency hotfix.",
    priority: "high",
    supportTitle: "Bug triage workflow",
    supportUrl: "/support/bug-report",
    supportSteps: [
      "Verify the issue is reproducible and capture exact steps.",
      "Collect error messages, screenshots, and environment data.",
      "Assign to the engineering team for investigation.",
      "Monitor resolution and communicate status updates."
    ]
  },
  "Account Issue": {
    action: "Account Management Team",
    details: "Send to account management. Verify identity and permissions. May require account recovery or reset.",
    priority: "high",
    supportTitle: "Account recovery guide",
    supportUrl: "/support/account-issue",
    supportSteps: [
      "Confirm account ownership and identity details.",
      "Check for locked or suspended status.",
      "Reset credentials or permissions if needed.",
      "Escalate to account specialists for sensitive cases."
    ]
  },
  "Feedback": {
    action: "Log for Product Review",
    details: "Document user feedback and share with product/UX team. Thank user for input and request follow-up permission.",
    priority: "low",
    supportTitle: "Feedback handling guide",
    supportUrl: "/support/feedback",
    supportSteps: [
      "Document the customer's feedback clearly.",
      "Share the suggestion with the product/UX team.",
      "Thank the customer for their input.",
      "Follow up if additional clarification is needed."
    ]
  },
  "Unknown": {
    action: "Manual Review Required",
    details: "Route to support supervisor for classification. Gather additional context if needed.",
    priority: "medium",
    supportTitle: "General support contact",
    supportUrl: "/support/contact-support",
    supportSteps: [
      "Review the issue details with a supervisor.",
      "Request additional customer context if needed.",
      "Classify the problem for the right team.",
      "Provide a clear next step for follow-up."
    ]
  }
};

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {object} - Recommended action with details
 */
const appBase = import.meta.env.BASE_URL || '/'
function resolveAppUrl(url) {
  const normalizedBase = appBase.endsWith('/') ? appBase.slice(0, -1) : appBase
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  return `${normalizedBase}${normalizedUrl}`
}

export function getRecommendedAction(category, urgency) {
  const template = actionTemplates[category] || actionTemplates["Unknown"];
  
  // Boost priority if high urgency
  let priority = template.priority;
  if (urgency === "High") priority = "urgent";
  
  return {
    action: template.action,
    details: template.details,
    priority: priority,
    estimatedTime: priority === "urgent" ? "< 5 min" : priority === "high" ? "< 1 hour" : "< 1 day",
    supportUrl: resolveAppUrl(template.supportUrl),
    supportTitle: template.supportTitle,
    supportSteps: template.supportSteps
  };
}

export function getSolutionReference(category) {
  const template = actionTemplates[category] || actionTemplates["Unknown"];
  return {
    title: template.supportTitle,
    url: resolveAppUrl(template.supportUrl),
    steps: template.supportSteps
  };
}

/**
 * Get all available categories
 * 
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates).filter(cat => cat !== "Unknown");
}

/**
 * Determines if message should be escalated
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @param {string} message - The original message
 * @returns {boolean} - Whether to escalate
 */
export function shouldEscalate(category, urgency, message) {
  // Escalate if high urgency
  if (urgency === "High") return true;
  
  // Escalate technical problems or billing issues
  if (["Technical Problem", "Billing Issue", "Bug Report", "Account Issue"].includes(category)) {
    return true;
  }
  
  // Escalate long, complex messages
  if (message.length > 300) return true;
  
  return false;
}

/**
 * Get department recommendation
 */
export function getDepartment(category) {
  const departments = {
    "Billing Issue": "💳 Billing",
    "Technical Problem": "🔧 Technical Support",
    "Bug Report": "🐛 Engineering",
    "Account Issue": "👤 Account Management",
    "General Inquiry": "📖 Knowledge Base",
    "Feature Request": "🎯 Product Team",
    "Feedback": "💭 Product Team",
    "Unknown": "🔍 Support Queue"
  };
  
  return departments[category] || "📞 General Support";
}
