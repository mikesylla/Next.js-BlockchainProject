// src/components/Newsletter.tsx
"use client";
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call - replace with your newsletter service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="glass-card p-8 text-center">
      <h3 className="text-2xl font-bold gradient-text mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-6">Get the latest blockchain tutorials and insights delivered to your inbox</p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn-primary disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </div>
        {status === 'success' && (
          <p className="text-green-400 mt-2">Thanks for subscribing! Check your email for confirmation.</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 mt-2">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}
