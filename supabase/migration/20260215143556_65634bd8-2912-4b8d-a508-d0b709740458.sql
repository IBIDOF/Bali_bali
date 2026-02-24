
-- Update handle_new_user to also insert into user_roles based on metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  selected_role text;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Auto-assign role from signup metadata
  selected_role := NEW.raw_user_meta_data->>'role';
  IF selected_role IN ('buyer', 'seller') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, selected_role::app_role);
  END IF;

  RETURN NEW;
END;
$$;
