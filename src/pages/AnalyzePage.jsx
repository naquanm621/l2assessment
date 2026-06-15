import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { analyzeMessage } from '../utils/llmHelper'
import { getUrgencyColor } from '../utils/urgencyScorer'
import { getSentimentColor } from '../utils/sentimentAnalyzer'

function AnalyzePage() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  useEffect(() => {
    const exampleMessage = localStorage.getItem('exampleMessage')
    if (exampleMessage) {
      setMessage(exampleMessage)
      localStorage.removeItem('exampleMessage')
    }
  }, [])

  const handleAnalyze = async () => {
    if (!message.trim()) {
      alert('Please enter a message to analyze')
      return
    }

    setIsLoading(true)
    setResults(null)
    setShowResults(false)
    setShowGuide(false)

    try {
      const analysisResult = await analyzeMessage(message)
      setResults(analysisResult)
      setShowResults(true)

      const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
      history.push(analysisResult)
      localStorage.setItem('triageHistory', JSON.stringify(history))
    } catch (error) {
      console.error('Error analyzing message:', error)
      alert('Error analyzing message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessage('')
    setResults(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Analyze Message
          </h1>
          <p className="text-gray-600 text-lg">Get instant AI-powered categorization and routing recommendations</p>
        </div>

        {/* Step Guide */}
        {showGuide && !results && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">How to Use</h2>
              <button onClick={() => setShowGuide(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">1</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Paste Customer Message</h3>
                  <p className="text-gray-600">Enter or paste the customer's message in the text area below. Include as much detail as possible for better analysis.</p>
                  <div className="mt-2 text-sm text-gray-500">💡 Example: "Our payment system is down and we can't process orders!"</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">2</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Click Analyze</h3>
                  <p className="text-gray-600">Press the "🚀 Analyze Message" button to start the AI analysis. The system will process your message instantly.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold">3</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Review Results</h3>
                  <p className="text-gray-600">You'll get four key insights:</p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li><strong className="text-blue-600">Category:</strong> What type of issue (Billing, Technical, etc.)</li>
                    <li><strong className="text-amber-600">Urgency:</strong> How quickly it needs attention (High/Medium/Low)</li>
                    <li><strong className="text-emerald-600">Sentiment:</strong> Customer's emotional tone (Positive/Negative/Neutral)</li>
                    <li><strong className="text-rose-600">Recommended Action:</strong> What to do next</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">4</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Copy or Analyze Another</h3>
                  <p className="text-gray-600">Copy the results to your clipboard or click "Analyze Another" to process a new message.</p>
                </div>
              </div>
            </div>

            {/* Understanding Results */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Your Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="font-bold text-blue-900 mb-2">📂 Category</div>
                  <p className="text-sm text-blue-800">The AI categorizes the message into one of these types:</p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1">
                    <li>• <strong>Billing Issue:</strong> Payment or invoice problems</li>
                    <li>• <strong>Technical Problem:</strong> System errors or bugs</li>
                    <li>• <strong>Feature Request:</strong> New feature suggestions</li>
                    <li>• <strong>Account Issue:</strong> Login or account problems</li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="font-bold text-amber-900 mb-2">⏱️ Urgency Level</div>
                  <p className="text-sm text-amber-800">How quickly the issue needs attention:</p>
                  <ul className="text-xs text-amber-700 mt-2 space-y-1">
                    <li>• <strong>🔴 High:</strong> Critical issue, handle within 5 mins</li>
                    <li>• <strong>🟡 Medium:</strong> Important, handle within 1 hour</li>
                    <li>• <strong>🟢 Low:</strong> Standard, handle within 1 day</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-2">💭 Sentiment</div>
                  <p className="text-sm text-emerald-800">The customer's emotional tone:</p>
                  <ul className="text-xs text-emerald-700 mt-2 space-y-1">
                    <li>• <strong>😊 Positive:</strong> Happy, satisfied customer</li>
                    <li>• <strong>😠 Negative:</strong> Frustrated or angry</li>
                    <li>• <strong>😐 Neutral:</strong> Factual, no clear emotion</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="font-bold text-purple-900 mb-2">✨ Confidence</div>
                  <p className="text-sm text-purple-800">How confident the AI is in its categorization:</p>
                  <ul className="text-xs text-purple-700 mt-2 space-y-1">
                    <li>• <strong>80-100%:</strong> Highly confident categorization</li>
                    <li>• <strong>60-79%:</strong> Good confidence level</li>
                    <li>• <strong>&lt;60%:</strong> May need manual review</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Customer Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste customer message here..."
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none font-medium text-gray-800 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm font-medium text-gray-500">{message.length} characters</div>
            <div className="text-xs text-gray-400">{message.length > 500 ? '✓ Good detail level' : message.length > 200 ? 'Good' : 'Short message'}</div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Analyze Message</span>
                </>
              )}
            </button>
            <button onClick={handleClear} disabled={isLoading} className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">Clear</button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className={`space-y-6 transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{results.category}</div>
                    <div className="text-sm text-gray-600">{results.department}</div>
                  </div>
                  <div className="text-4xl opacity-90 text-blue-500">📂</div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-600">Confidence</div>
                  <div className="mt-2 bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" style={{width: `${(results.confidence || 0.8) * 100}%`}} />
                  </div>
                  <div className="text-sm font-bold text-gray-700 mt-2">{Math.round((results.confidence || 0.8) * 100)}%</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Urgency Level</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-2xl font-bold mb-2 px-4 py-2 rounded-lg inline-block ${getUrgencyColor(results.urgency)}`}>{results.urgency}</div>
                    <div className="text-sm text-gray-600 mt-3">{results.recommendedAction.estimatedTime}</div>
                  </div>
                  <div className="text-4xl opacity-90 text-amber-500">⏱️</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sentiment</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-2xl font-bold mb-2 px-4 py-2 rounded-lg inline-block border ${getSentimentColor(results.sentiment)}`}>{results.sentiment}</div>
                    <div className="text-sm text-gray-600 mt-3">Tone & Emotion Analysis</div>
                  </div>
                  <div className="text-4xl opacity-90 text-emerald-500">💭</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recommended Action</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{results.recommendedAction.action}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">{results.recommendedAction.details}</div>
                  </div>
                  <div className="text-4xl opacity-90 text-purple-500">✨</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Solution Reference</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{results.recommendedAction.supportTitle || 'Troubleshooting guide'}</div>
                    <div className="text-sm text-gray-600 mb-4">Use this reference to resolve the customer issue faster with guided steps.</div>
                    <div className="space-y-2 text-sm text-gray-700">
                      {results.recommendedAction.supportSteps?.slice(0, 3).map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-slate-400">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={results.recommendedAction.supportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center mt-5 rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200"
                    >
                      Open full guide
                    </a>
                  </div>
                  <div className="text-4xl opacity-90 text-cyan-500">🔗</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-white/50">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">AI Reasoning</div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="prose prose-sm max-w-none text-gray-700 font-medium">
                  <ReactMarkdown>{results.reasoning}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => {
                const text = `ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: ${results.category}
Urgency: ${results.urgency}
Sentiment: ${results.sentiment}
Department: ${results.department}

RECOMMENDED ACTION
${results.recommendedAction.action}
${results.recommendedAction.details}

REASONING
${results.reasoning}`
                navigator.clipboard.writeText(text)
                alert('Results copied to clipboard!')
              }} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2">
                <span className="text-cyan-100">📋</span>
                <span>Copy Results</span>
              </button>
              <button onClick={handleClear} className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200">Analyze Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyzePage
