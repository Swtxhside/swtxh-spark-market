import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  role: string;
}

interface Vendor {
  id: string;
  store_name: string;
  tier: string;
  commission_rate: number;
  subscription_status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: UserProfile | null;
  vendor: Vendor | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile from users table
      const { data: profileData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      setUserProfile(profileData);

      // Check if user is admin using the secure role system
      const { data: adminCheck } = await supabase
        .rpc('has_role', { _user_id: userId, _role: 'admin' });
      
      setIsAdmin(adminCheck || false);

      // If user is a vendor, load vendor data
      if (profileData?.role === 'vendor') {
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('id, store_name, tier, commission_rate, subscription_status')
          .eq('user_id', userId)
          .maybeSingle();
        
        setVendor(vendorData);
      } else {
        setVendor(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls to prevent auth deadlocks
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setVendor(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userProfile,
      vendor,
      isAdmin,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}