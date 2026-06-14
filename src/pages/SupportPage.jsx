import { useParams, Link } from 'react-router-dom'
import { getSolutionReference } from '../utils/templates'

const supportRoutes = {
  'billing-issue': 'Billing Issue',
  'technical-problem': 'Technical Problem',
  'general-inquiry': 'General Inquiry',
  'feature-request': 'Feature Request',
  'bug-report': 'Bug Report',
  'account-issue': 'Account Issue',
  'feedback': 'Feedback',
  'contact-support': 'Unknown'
}

function SupportPage() {
  const params = useParams()
  const categoryKey = supportRoutes[params.topic] || 'Unknown'
  const reference = getSolutionReference(categoryKey)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-white/70">
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Support Reference</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{reference.title}</h1>
            <p className="text-gray-600 text-lg">A short guide for handling {categoryKey.toLowerCase()} messages and recommended next steps.</p>
          </div>

          <div className="grid gap-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Top steps to follow</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                {reference.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Why this helps</h2>
              <p className="text-gray-700 leading-7">
                This guide is designed to give support agents a practical playbook for the issue category, with clear next steps, escalation checkpoints, and a structured approach.
              </p>
            </div>

            <div className="bg-blue-600 rounded-3xl p-6 text-white">
              <h2 className="text-xl font-semibold mb-3">Use this reference</h2>
              <p className="text-sm leading-7">
                Use this page when triaging the customer issue from Analyze or History. It is part of the app’s support workflow and gives agents a quick, consistent resolution path.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link to="/analyze" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-all duration-200">
              Analyze another message
            </Link>
            <Link to="/history" className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-slate-900 font-semibold hover:bg-slate-200 transition-all duration-200">
              View history
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage
