import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog('React component mounted successfully');
    addLog(`Environment: ${import.meta.env.MODE}`);
    addLog(`Supabase URL: ${import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING'}`);
    addLog(`Supabase Key: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}`);
    
    // Test Supabase connection
    import('@/lib/supabase').then(({ supabase }) => {
      addLog('Supabase module loaded');
      return supabase.auth.getSession();
    }).then(({ data, error }) => {
      if (error) {
        addLog(`Supabase error: ${error.message}`);
      } else {
        addLog('Supabase connection successful');
        addLog(`Session: ${data.session ? 'Active' : 'None'}`);
      }
    }).catch(err => {
      addLog(`Supabase connection failed: ${err.message}`);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Diagnostic Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
              <span>React App Running</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
              <span>Vite Dev Server Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Real-time Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div>Waiting for logs...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
            <button 
              onClick={() => window.location.href = '/test-supabase'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Supabase
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}