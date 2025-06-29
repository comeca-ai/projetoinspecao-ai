import { supabase } from '../../src/lib/supabase';

describe('Supabase Client', () => {
  it('should be initialized with environment variables', () => {
    expect(supabase).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('should be able to connect to Supabase', async () => {
    const { data, error } = await supabase.auth.getSession();
    
    // We don't expect an error, but we might not have a session
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.session).toBeDefined();
  });
});
