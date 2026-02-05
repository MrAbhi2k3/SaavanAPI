export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-purple-300">Version 2.0 • Blazing Fast</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              JioSaavn API
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Unlock the power of music with our cutting-edge API. Stream, search, and discover millions of songs with unmatched performance and reliability.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="/api/docs"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Get Started →
            </a>
            <a
              href="https://github.com/MrAbhi2k3/jiosaavn-api"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl font-semibold text-white hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-300 hover:scale-105"
            >
              View on GitHub ⭐
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Built with performance in mind. Experience blazing-fast response times and seamless data retrieval.",
            },
            {
              icon: "🎵",
              title: "Comprehensive API",
              description: "Access songs, albums, artists, playlists, and more. Everything you need in one powerful API.",
            },
            {
              icon: "💻",
              title: "TypeScript First",
              description: "Fully typed for the best developer experience. Auto-complete and type safety out of the box.",
            },
            {
              icon: "🔒",
              title: "Open Source",
              description: "Completely open source and free to use. Contribute, fork, or customize to your needs.",
            },
            {
              icon: "📚",
              title: "Full Documentation",
              description: "Comprehensive docs with examples, guides, and API references to get you started quickly.",
            },
            {
              icon: "🚀",
              title: "Active Community",
              description: "Join our growing community. Get support, share ideas, and collaborate on improvements.",
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-purple-300">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Creator Section */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-gray-700/50 p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 text-sm font-semibold text-purple-300">
                Created by
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                MrAbhi2k3
              </h2>
              <p className="text-gray-400 leading-relaxed max-w-2xl">
                Passionate developer crafting powerful APIs and tools. Connect with me to collaborate, contribute, or just say hi!
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="https://github.com/MrAbhi2k3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 border border-gray-700 rounded-xl hover:bg-gray-700/80 hover:border-purple-500/50 transition-all duration-300"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/kumaarabhishek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 border border-gray-700 rounded-xl hover:bg-gray-700/80 hover:border-blue-500/50 transition-all duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="https://t.me/teleroidgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 border border-gray-700 rounded-xl hover:bg-gray-700/80 hover:border-cyan-500/50 transition-all duration-300"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2026 MrAbhi2k3 • Built with ❤️ and TypeScript</p>
        </div>
      </div>
    </div>
  );
}
