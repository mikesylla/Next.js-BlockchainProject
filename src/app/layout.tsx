// src/app/layout.tsx - Updated with search functionality
import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Blockchain Developer Blog',
  description: 'Journey through Solidity, Cairo, Scaffold-Stark, and Dojo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative">
            <header className="glass-card mx-4 mt-4 mb-8">
              <div className="container mx-auto px-6 py-4">
                <nav className="flex items-center justify-between">
                  <Link href="/" className="text-2xl font-bold gradient-text">
                    BlockchainDev
                  </Link>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-white hover:text-blue-400 transition-colors">
                      Home
                    </Link>
                    <Link href="/posts" className="text-white hover:text-blue-400 transition-colors">
                      Posts
                    </Link>
                    <Link href="/tutorials" className="text-white hover:text-blue-400 transition-colors">
                      Tutorials
                    </Link>
                    <Link href="/courses" className="text-white hover:text-blue-400 transition-colors">
                      Courses
                    </Link>
                    <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
                      About
                    </Link>
                    
                    {/* Search Link with Icon */}
                    <Link 
                      href="/search" 
                      className="text-white hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search</span>
                    </Link>
                  </div>
                  
                  {/* Right side with Global Search and Connect Wallet */}
                  <div className="flex items-center gap-4">
                    {/* Global Search Component */}
                    <GlobalSearch />
                    
                    <button className="btn-primary hidden md:block">Connect Wallet</button>
                    
                    {/* Mobile menu button */}
                    <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </nav>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="glass-card mx-4 mt-16 mb-4">
              <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-xl font-bold gradient-text mb-4">BlockchainDev</h3>
                    <p className="text-gray-300">
                      Documenting the journey through blockchain development technologies.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Technologies</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>Solidity</li>
                      <li>Cairo</li>
                      <li>Scaffold-Stark</li>
                      <li>Dojo</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li><Link href="/posts" className="hover:text-blue-400 transition-colors">Blog Posts</Link></li>
                      <li><Link href="/tutorials" className="hover:text-blue-400 transition-colors">Tutorials</Link></li>
                      <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Courses</Link></li>
                      <li><Link href="/search" className="hover:text-blue-400 transition-colors">Search</Link></li>
                      <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com" className="text-gray-300 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 BlockchainDev Blog. Built with Next.js and passion for blockchain.</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}