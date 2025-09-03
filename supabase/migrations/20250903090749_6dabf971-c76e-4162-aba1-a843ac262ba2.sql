-- Step 1: Create secure role system
CREATE TYPE public.app_role AS ENUM ('admin', 'vendor', 'customer');

-- User roles table with proper RLS
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Basic RLS policy for user_roles (users can see their own roles)
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 2: Create enforcement triggers for admin-controlled fields

-- Trigger to enforce vendor admin-only fields
CREATE OR REPLACE FUNCTION public.enforce_vendor_admin_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins to change anything
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Block changes to admin-controlled fields for non-admins
  IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status OR
     OLD.commission_rate IS DISTINCT FROM NEW.commission_rate OR
     OLD.tier IS DISTINCT FROM NEW.tier THEN
    RAISE EXCEPTION 'Only admins can modify subscription_status, commission_rate, or tier';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_vendor_admin_fields_trigger
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_vendor_admin_fields();

-- Trigger to enforce user protected columns
CREATE OR REPLACE FUNCTION public.enforce_user_protected_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins to change anything
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Block changes to protected fields for non-admins
  IF OLD.role IS DISTINCT FROM NEW.role OR
     OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    RAISE EXCEPTION 'Only admins can modify role or is_admin fields';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_user_protected_columns_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_user_protected_columns();

-- Step 3: Update all RLS policies to use has_role function

-- Drop problematic self-referential policies on users table
DROP POLICY IF EXISTS "Admin (is_admin) full access users" ON public.users;
DROP POLICY IF EXISTS "Admin full access users" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to all tables" ON public.users;

-- Create secure admin policy for users
CREATE POLICY "Secure admin full access users" 
ON public.users 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update vendors table policies
DROP POLICY IF EXISTS "Admin full access vendors" ON public.vendors;
CREATE POLICY "Secure admin full access vendors" 
ON public.vendors 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update products table policies  
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

CREATE POLICY "Secure admin full access products" 
ON public.products 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can view products (no anonymous access)
CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
TO authenticated
USING (true);

-- Update orders table policies
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Secure admin full access orders" 
ON public.orders 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update order_items table policies
DROP POLICY IF EXISTS "Admin full access order_items" ON public.order_items;
CREATE POLICY "Secure admin full access order_items" 
ON public.order_items 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update subscriptions table policies
DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.subscriptions;
CREATE POLICY "Secure admin full access subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 4: Update database functions to be more secure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert default role into user_roles
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::app_role
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_vendor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  -- Only create vendor profile if role = 'vendor'
  IF NEW.role = 'vendor' THEN
    INSERT INTO vendors (user_id, business_name, subscription_plan, store_name)
    VALUES (NEW.id, '', 'Basic', COALESCE(NEW.name, 'My Store'));
    
    -- Ensure vendor role is set
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'vendor')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;