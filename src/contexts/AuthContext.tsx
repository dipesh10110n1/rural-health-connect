import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type UserRole = "doctor" | "hospital" | "patient" | "asha_worker" | "relative";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, additionalData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session is established
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setUserRole(data?.role as UserRole);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole, 
    additionalData?: any
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role,
            ...additionalData
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        return { error };
      }
      
      if (data.user) {
        // Insert user role first - this is critical
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: role
        });

        if (roleError) {
          console.error("Role insertion error:", roleError);
          return { error: roleError };
        }

        // Insert role-specific profile
        let profileError = null;
        switch (role) {
          case "patient":
            const { error: patientError } = await supabase.from("patients").insert({
              user_id: data.user.id,
              name: additionalData.name,
              age: additionalData.age,
              gender: additionalData.gender,
              phone: additionalData.phone,
              village: additionalData.village
            });
            profileError = patientError;
            break;
          case "doctor":
            const { error: doctorError } = await supabase.from("doctors").insert({
              user_id: data.user.id,
              name: additionalData.name,
              specialization: additionalData.specialization,
              phone: additionalData.phone,
              hospital: additionalData.hospital
            });
            profileError = doctorError;
            break;
          case "hospital":
            const { error: hospitalError } = await supabase.from("hospitals").insert({
              user_id: data.user.id,
              name: additionalData.name,
              address: additionalData.address,
              phone: additionalData.phone,
              email: email,
              specialty: additionalData.specialty,
              beds_available: additionalData.beds_available || 0,
              ambulance_available: additionalData.ambulance_available || false
            });
            profileError = hospitalError;
            break;
          case "asha_worker":
            const { error: ashaError } = await supabase.from("health_workers").insert({
              user_id: data.user.id,
              name: additionalData.name,
              phone: additionalData.phone,
              village: additionalData.village,
              role: "ASHA"
            });
            profileError = ashaError;
            break;
          case "relative":
            const { error: relativeError } = await supabase.from("relatives").insert({
              user_id: data.user.id,
              name: additionalData.name,
              phone: additionalData.phone,
              relation_to_patient: additionalData.relation_to_patient
            });
            profileError = relativeError;
            break;
        }

        if (profileError) {
          console.error("Profile insertion error:", profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error("Signup catch error:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    navigate("/auth");
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
