-- Add INSERT policy for vendors table to allow users to create their own vendor records
CREATE POLICY "Users can create their own vendor record" 
ON public.vendors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for users table to allow user registration  
CREATE POLICY "Users can insert their own profile during signup"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);