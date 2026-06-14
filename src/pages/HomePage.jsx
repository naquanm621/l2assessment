import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSolutionReference } from '../utils/templates'

function HomePage() {
  const [stats, setStats] = useState({ total: 0, today: 0 })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Load stats from localStorage
    const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
    const today = new Date().toDateString()
    const todayCount = history.filter(item => 
      new Date(item.timestamp).toDateString() === today
    ).length

    setStats({
      total: history.length,
      today: todayCount
    })

    // Get recent 3 items
    setRecentActivity(history.slice(-3).reverse())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
              Relay AI
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mb-4">
              Customer Triage Platform
            </p>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Intelligent message categorization and routing powered by advanced AI
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                <p className="text-blue-100">AI-powered categorization in seconds</p>
              </div>
              <div>
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Smart Routing</h3>
                <p className="text-blue-100">Automatic department assignment</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Urgent Prioritization</h3>
                <p className="text-blue-100">Handle critical issues first</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-white/50">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Messages</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats.total}
                </div>
              </div>
              <div className="text-6xl opacity-30">📈</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-white/50">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Analyzed Today</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stats.today}
                </div>
              </div>
              <div className="text-6xl opacity-30">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/analyze"
            className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 cursor-pointer"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">Analyze</div>
            <p className="text-gray-600 mb-4">Triage a new customer message</p>
            <div className="inline-flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
              Start analyzing <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/history"
            className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 cursor-pointer"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">History</div>
            <p className="text-gray-600 mb-4">View past analyses and patterns</p>
            <div className="inline-flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
              View history <span className="ml-2">→</span>
            </div>
          </Link>

          <button
            onClick={() => {
              const examples = [
                "Our payment failed and we can't access our account. The error keeps showing: 'Invalid card'",
                "The dashboard has been loading for 5 minutes and shows a spinning icon. Very frustrating!",
                "Would it be possible to add a dark mode feature? Many users have requested this."
              ]
              const random = examples[Math.floor(Math.random() * examples.length)]
              localStorage.setItem('exampleMessage', random)
              window.location.href = '/analyze'
            }}
            className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 cursor-pointer"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">Try Example</div>
            <p className="text-gray-600 mb-4">See AI in action with sample messages</p>
            <div className="inline-flex items-center text-amber-600 font-bold group-hover:translate-x-2 transition-transform">
              Try example <span className="ml-2">→</span>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-white/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Latest Solution Reference</h3>
              <p className="text-gray-600 mt-2">
                Get a reference guide for your most recent issue and follow step-by-step problem guidance.
              </p>
            </div>
            <a
              href={recentActivity.length > 0 ? getSolutionReference(recentActivity[0].category).url : 'https://support.example.com'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Open reference
            </a>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-sm font-semibold text-slate-500 mb-2">Issue Type</div>
              <div className="text-lg font-bold text-slate-900">
                {recentActivity.length > 0 ? recentActivity[0].category : 'No issues yet'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-sm font-semibold text-slate-500 mb-2">Recommended Action</div>
              <div className="text-lg font-bold text-slate-900">
                {recentActivity.length > 0 ? getSolutionReference(recentActivity[0].category).title : 'Run an analysis to unlock guidance'}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className="text-gray-400">⏱️</div>
                  </div>
                  <p className="text-gray-800 font-medium mb-3">
                    "{item.message.substring(0, 80)}{item.message.length > 80 ? '...' : ''}"
                  </p>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs bg-blue-200 text-blue-900 px-3 py-1 rounded-full font-semibold">
                      {item.category}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      item.urgency === 'High' ? 'bg-red-200 text-red-900' :
                      item.urgency === 'Medium' ? 'bg-amber-200 text-amber-900' :
                      'bg-emerald-200 text-emerald-900'
                    }`}>
                      {item.urgency} Urgency
                    </span>
                    {item.sentiment && (
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.sentiment === 'Positive' ? 'bg-emerald-200 text-emerald-900' :
                        item.sentiment === 'Negative' ? 'bg-red-200 text-red-900' :
                        'bg-slate-200 text-slate-900'
                      }`}>
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentActivity.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">No messages analyzed yet</div>
            <p className="text-gray-600 mb-6">Start by analyzing your first customer message</p>
            <Link
              to="/analyze"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
            >
              Analyze First Message 🚀
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
