-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type_id ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for audit logs
-- Only admins can view all audit logs
CREATE POLICY admin_all_audit_logs ON audit_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Users can view their own audit logs
CREATE POLICY user_own_audit_logs ON audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically log data modifications
CREATE OR REPLACE FUNCTION log_data_modification()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
  action_type TEXT;
  resource_data JSONB;
BEGIN
  -- Get current user ID from Supabase auth context
  user_id := auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    resource_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
    resource_data := jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW),
      'changed_fields', (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each(to_jsonb(NEW))
        WHERE to_jsonb(NEW) -> key <> to_jsonb(OLD) -> key
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
    resource_data := to_jsonb(OLD);
  END IF;
  
  -- Insert audit log entry
  INSERT INTO audit_logs (
    user_id,
    action,
    category,
    severity,
    resource_type,
    resource_id,
    details,
    status
  ) VALUES (
    user_id,
    action_type || '_' || TG_TABLE_NAME,
    'data_modification',
    CASE
      WHEN TG_TABLE_NAME IN ('users', 'teams', 'clients') THEN 'warning'
      ELSE 'info'
    END,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'INSERT' THEN NEW.id
      ELSE OLD.id
    END,
    resource_data,
    'success'
  );
  
  -- Return appropriate record based on operation
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to sensitive tables
CREATE TRIGGER log_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_data_modification();

CREATE TRIGGER log_teams_changes
AFTER INSERT OR UPDATE OR DELETE ON teams
FOR EACH ROW EXECUTE FUNCTION log_data_modification();

CREATE TRIGGER log_clients_changes
AFTER INSERT OR UPDATE OR DELETE ON clients
FOR EACH ROW EXECUTE FUNCTION log_data_modification();

CREATE TRIGGER log_inspections_changes
AFTER INSERT OR UPDATE OR DELETE ON inspections
FOR EACH ROW EXECUTE FUNCTION log_data_modification();

CREATE TRIGGER log_templates_changes
AFTER INSERT OR UPDATE OR DELETE ON templates
FOR EACH ROW EXECUTE FUNCTION log_data_modification();

-- Create view for admin dashboard
CREATE OR REPLACE VIEW admin_audit_summary AS
SELECT
  date_trunc('day', created_at) AS day,
  category,
  severity,
  status,
  COUNT(*) AS event_count
FROM audit_logs
GROUP BY day, category, severity, status
ORDER BY day DESC, category, severity;

-- Grant permissions
GRANT SELECT ON audit_logs TO authenticated;
GRANT SELECT ON admin_audit_summary TO authenticated;
