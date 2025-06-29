import { useEffect } from 'react';

export default function SimpleApp() {
  useEffect(() => {
    console.log('SimpleApp mounted!');
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>React is Working! 🎉</h1>
      <p>If you can see this, React loaded successfully.</p>
      <hr />
      <h2>Environment Variables:</h2>
      <ul>
        <li>Mode: {import.meta.env.MODE}</li>
        <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
        <li>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
      </ul>
      <hr />
      <h2>Quick Links:</h2>
      <button onClick={() => window.location.href = '/'}>Go to Main App</button>
    </div>
  );
}