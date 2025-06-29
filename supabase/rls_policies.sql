-- Row Level Security (RLS) policies for Supabase
-- This file contains SQL commands to set up RLS policies for all tables in the database

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create a function to check if user is authenticated
CREATE OR REPLACE FUNCTION auth.is_authenticated() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is gestor
CREATE OR REPLACE FUNCTION auth.is_gestor() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'gestor' FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user belongs to a team
CREATE OR REPLACE FUNCTION auth.is_team_member(team_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND equipe_id = team_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user belongs to a client
CREATE OR REPLACE FUNCTION auth.is_client_member(client_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND cliente_id = client_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user can access an inspection
CREATE OR REPLACE FUNCTION auth.can_access_inspection(inspection_id UUID) RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  user_team_id UUID;
  user_client_id UUID;
  inspection_user_id UUID;
  inspection_team_id UUID;
  inspection_client_id UUID;
BEGIN
  -- Get user information
  SELECT role, equipe_id, cliente_id 
  INTO user_role, user_team_id, user_client_id 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Get inspection information
  SELECT user_id, team_id, client_id 
  INTO inspection_user_id, inspection_team_id, inspection_client_id 
  FROM public.inspections 
  WHERE id = inspection_id;
  
  -- Admin can access all inspections
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- User can access their own inspections
  IF inspection_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  
  -- Gestor can access team inspections
  IF user_role = 'gestor' AND user_team_id = inspection_team_id AND inspection_team_id IS NOT NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Gestor can access client inspections
  IF user_role = 'gestor' AND user_client_id = inspection_client_id AND inspection_client_id IS NOT NULL THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user can access a template
CREATE OR REPLACE FUNCTION auth.can_access_template(template_id UUID) RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  user_team_id UUID;
  template_user_id UUID;
  template_team_id UUID;
  is_public BOOLEAN;
BEGIN
  -- Get user information
  SELECT role, equipe_id 
  INTO user_role, user_team_id 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Get template information
  SELECT user_id, team_id, is_public 
  INTO template_user_id, template_team_id, is_public 
  FROM public.templates 
  WHERE id = template_id;
  
  -- Admin can access all templates
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Public templates can be accessed by anyone
  IF is_public THEN
    RETURN TRUE;
  END IF;
  
  -- User can access their own templates
  IF template_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  
  -- User can access team templates
  IF user_team_id = template_team_id AND template_team_id IS NOT NULL THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
-- Users can read their own data
CREATE POLICY users_read_own ON users
  FOR SELECT
  USING (id = auth.uid());

-- Users can update their own data
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (id = auth.uid());

-- Admin can read all users
CREATE POLICY users_read_admin ON users
  FOR SELECT
  USING (auth.is_admin());

-- Admin can update all users
CREATE POLICY users_update_admin ON users
  FOR UPDATE
  USING (auth.is_admin());

-- Gestor can read users in their team
CREATE POLICY users_read_team ON users
  FOR SELECT
  USING (
    auth.is_gestor() AND 
    equipe_id IN (SELECT equipe_id FROM users WHERE id = auth.uid())
  );

-- Inspections table policies
-- Users can read their own inspections
CREATE POLICY inspections_read_own ON inspections
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own inspections
CREATE POLICY inspections_update_own ON inspections
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own inspections
CREATE POLICY inspections_delete_own ON inspections
  FOR DELETE
  USING (user_id = auth.uid());

-- Users can insert their own inspections
CREATE POLICY inspections_insert_own ON inspections
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin can read all inspections
CREATE POLICY inspections_read_admin ON inspections
  FOR SELECT
  USING (auth.is_admin());

-- Admin can update all inspections
CREATE POLICY inspections_update_admin ON inspections
  FOR UPDATE
  USING (auth.is_admin());

-- Admin can delete all inspections
CREATE POLICY inspections_delete_admin ON inspections
  FOR DELETE
  USING (auth.is_admin());

-- Gestor can read team inspections
CREATE POLICY inspections_read_team ON inspections
  FOR SELECT
  USING (
    auth.is_gestor() AND 
    team_id IN (SELECT equipe_id FROM users WHERE id = auth.uid())
  );

-- Gestor can update team inspections
CREATE POLICY inspections_update_team ON inspections
  FOR UPDATE
  USING (
    auth.is_gestor() AND 
    team_id IN (SELECT equipe_id FROM users WHERE id = auth.uid())
  );

-- Inspection tests table policies
-- Users can read tests for inspections they can access
CREATE POLICY inspection_tests_read ON inspection_tests
  FOR SELECT
  USING (auth.can_access_inspection(inspection_id));

-- Users can update tests for inspections they can access
CREATE POLICY inspection_tests_update ON inspection_tests
  FOR UPDATE
  USING (auth.can_access_inspection(inspection_id));

-- Users can insert tests for inspections they can access
CREATE POLICY inspection_tests_insert ON inspection_tests
  FOR INSERT
  WITH CHECK (auth.can_access_inspection(inspection_id));

-- Users can delete tests for inspections they can access
CREATE POLICY inspection_tests_delete ON inspection_tests
  FOR DELETE
  USING (auth.can_access_inspection(inspection_id));

-- Tests table policies
-- All authenticated users can read tests
CREATE POLICY tests_read ON tests
  FOR SELECT
  USING (auth.is_authenticated());

-- Admin can insert, update, delete tests
CREATE POLICY tests_admin_all ON tests
  FOR ALL
  USING (auth.is_admin());

-- Templates table policies
-- Users can read templates they can access
CREATE POLICY templates_read ON templates
  FOR SELECT
  USING (
    is_public OR 
    user_id = auth.uid() OR 
    auth.is_admin() OR
    (team_id IS NOT NULL AND auth.is_team_member(team_id))
  );

-- Users can update their own templates
CREATE POLICY templates_update_own ON templates
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own templates
CREATE POLICY templates_delete_own ON templates
  FOR DELETE
  USING (user_id = auth.uid());

-- Users can insert their own templates
CREATE POLICY templates_insert_own ON templates
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin can update all templates
CREATE POLICY templates_update_admin ON templates
  FOR UPDATE
  USING (auth.is_admin());

-- Admin can delete all templates
CREATE POLICY templates_delete_admin ON templates
  FOR DELETE
  USING (auth.is_admin());

-- Gestor can update team templates
CREATE POLICY templates_update_team ON templates
  FOR UPDATE
  USING (
    auth.is_gestor() AND 
    team_id IN (SELECT equipe_id FROM users WHERE id = auth.uid())
  );

-- Teams table policies
-- Users can read their own team
CREATE POLICY teams_read_own ON teams
  FOR SELECT
  USING (id IN (SELECT equipe_id FROM users WHERE id = auth.uid()));

-- Admin can read all teams
CREATE POLICY teams_read_admin ON teams
  FOR SELECT
  USING (auth.is_admin());

-- Admin can update all teams
CREATE POLICY teams_update_admin ON teams
  FOR UPDATE
  USING (auth.is_admin());

-- Admin can delete all teams
CREATE POLICY teams_delete_admin ON teams
  FOR DELETE
  USING (auth.is_admin());

-- Admin can insert teams
CREATE POLICY teams_insert_admin ON teams
  FOR INSERT
  WITH CHECK (auth.is_admin());

-- Gestor can update their own team
CREATE POLICY teams_update_gestor ON teams
  FOR UPDATE
  USING (
    auth.is_gestor() AND 
    id IN (SELECT equipe_id FROM users WHERE id = auth.uid())
  );

-- Clients table policies
-- Users can read their own client
CREATE POLICY clients_read_own ON clients
  FOR SELECT
  USING (id IN (SELECT cliente_id FROM users WHERE id = auth.uid()));

-- Admin can read all clients
CREATE POLICY clients_read_admin ON clients
  FOR SELECT
  USING (auth.is_admin());

-- Admin can update all clients
CREATE POLICY clients_update_admin ON clients
  FOR UPDATE
  USING (auth.is_admin());

-- Admin can delete all clients
CREATE POLICY clients_delete_admin ON clients
  FOR DELETE
  USING (auth.is_admin());

-- Admin can insert clients
CREATE POLICY clients_insert_admin ON clients
  FOR INSERT
  WITH CHECK (auth.is_admin());

-- Gestor can update their own client
CREATE POLICY clients_update_gestor ON clients
  FOR UPDATE
  USING (
    auth.is_gestor() AND 
    id IN (SELECT cliente_id FROM users WHERE id = auth.uid())
  );
