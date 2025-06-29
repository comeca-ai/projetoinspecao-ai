import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function TestSupabaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          setConnectionStatus('✅ Connected to Supabase');
          console.log('Session data:', data.session);
        } else {
          setConnectionStatus('✅ Connected to Supabase (No active session)');
        }
      } catch (err) {
        console.error('Error connecting to Supabase:', err);
        setError(`❌ Connection failed: ${err.message}`);
        setConnectionStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      <div className="space-y-2">
        <p><strong>Status:</strong> {connectionStatus}</p>
        {error && (
          <div className="p-2 bg-destructive/10 text-destructive rounded">
            <p className="font-medium">Error:</p>
            <pre className="text-sm mt-1 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        <div className="text-sm text-muted-foreground mt-2">
          <p>Check the browser console for more details.</p>
          <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  );
}
