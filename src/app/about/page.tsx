// src/app/about/page.tsx - About page
import { getStaticContent, markdownToHtml } from '../../../lib/markdown';
import { notFound } from 'next/navigation';

export default async function AboutPage() {
  try {
    const aboutContent = getStaticContent('pages', 'about');
    const htmlContent = await markdownToHtml(aboutContent.content);

    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            {aboutContent.title}
          </h1>
          
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              '--tw-prose-body': '#d1d5db',
              '--tw-prose-headings': '#ffffff',
              '--tw-prose-links': '#60a5fa',
              '--tw-prose-code': '#a855f7',
              '--tw-prose-pre-bg': '#1f2937',
              '--tw-prose-pre-code': '#e5e7eb',
            } as React.CSSProperties}
          />
        </div>
        
        {/* Additional sections */}
        <div className="grid-cols-2 mt-8 gap-8">
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Focus Areas</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Smart Contract Development</li>
              <li>• Zero-Knowledge Proofs</li>
              <li>• DeFi Protocols</li>
              <li>• Onchain Gaming</li>
            </ul>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🛠️ Tools & Frameworks</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Hardhat & Foundry</li>
              <li>• StarkNet CLI</li>
              <li>• Scaffold-Stark</li>
              <li>• Dojo Engine</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <a href="/" className="btn-secondary">
            ← Back to Home
          </a>
        </div>
      </div>
    );
    
  } catch (error) {
    // If about.md doesn't exist, show a default page
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-8">About This Blog</h1>
          <p className="text-xl text-gray-300 mb-6">
            Welcome to my blockchain development journey!
          </p>
          <p className="text-gray-300 mb-8">
            This blog documents my exploration of cutting-edge blockchain technologies 
            including Solidity, Cairo, Scaffold-Stark, and Dojo.
          </p>
          <a href="/" className="btn-primary">
            Explore the Blog
          </a>
        </div>
      </div>
    );
  }
}