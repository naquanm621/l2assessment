import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white/20 backdrop-blur rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-white/30 transition-colors">
              📧
            </div>
            <div>
              <div className="font-bold text-lg">Relay AI</div>
              <div className="text-xs text-blue-200">Customer Triage</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/analyze"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive('/analyze') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              📝 Analyze
            </Link>
            <Link
              to="/history"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive('/history') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              📊 History
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              📈 Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
