// components/Newsletter.tsx
"use client";
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Add your newsletter service integration here
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <section className="glass-card p-8 text-center">
      <h3 className="text-2xl font-bold gradient-text mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-6">Get the latest blockchain tutorials and insights</p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            required
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn-primary"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </div>
        {status === 'success' && (
          <p className="text-green-400 mt-2">Thanks for subscribing!</p>
        )}
      </form>
    </section>
  );
}