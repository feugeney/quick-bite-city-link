import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{isAdmin: boolean}>;
  signOut: () => Promise<void>;
  createAdminAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createAdminAccount = async () => {
    try {
      const adminEmail = "admin@nimbaexpress.com";
      const adminPassword = "AdminNimba2024!";
      
      console.log("Création du compte administrateur...");
      
      // Essayer de créer le compte admin
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            first_name: 'Super',
            last_name: 'Admin',
            role: 'admin'
          }
        }
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        throw signUpError;
      }

      // Si l'utilisateur existe déjà, essayer de se connecter pour vérifier
      if (signUpError?.message.includes('User already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (signInData.user && !signInError) {
          // Vérifier/mettre à jour le profil
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signInData.user.id,
              role: 'admin',
              first_name: 'Super',
              last_name: 'Admin'
            });

          if (profileError) {
            console.error('Erreur mise à jour profil:', profileError);
          }

          // Se déconnecter après vérification
          await supabase.auth.signOut();
        }
      } else if (signUpData.user) {
        // Nouveau compte créé, créer le profil
        setTimeout(async () => {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user!.id,
              role: 'admin',
              first_name: 'Super',
              last_name: 'Admin'
            });

          if (profileError) {
            console.error('Erreur création profil admin:', profileError);
          }
        }, 1000);
        
        // Se déconnecter après création
        await supabase.auth.signOut();
      }

      toast({
        title: "Compte administrateur prêt",
        description: "Vous pouvez maintenant vous connecter avec les identifiants admin.",
      });
      
    } catch (error: any) {
      console.error("Erreur création admin:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du compte admin.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string = 'client') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Compte créé avec succès !",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter avec vos identifiants.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion pour:", email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur d'authentification:", error);
        throw error;
      }

      if (!authData.user) {
        throw new Error("Aucun utilisateur trouvé");
      }

      console.log("Connexion réussie, vérification du profil...");
      
      // Attendre un moment pour que la session soit bien établie
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérifier le rôle de l'utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
        
      console.log("Données du profil:", profileData, "Erreur:", profileError);
      
      let isAdmin = false;
      
      if (profileError) {
        console.log("Erreur lors de la récupération du profil, création en cours...");
        // Si le profil n'existe pas, le créer
        const role = authData.user.user_metadata?.role || 'client';
        const { error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            role: role,
            first_name: authData.user.user_metadata?.first_name,
            last_name: authData.user.user_metadata?.last_name
          });
          
        if (createError) {
          console.error("Erreur création profil:", createError);
        }
        
        isAdmin = role === 'admin';
      } else {
        isAdmin = profileData?.role === 'admin';
      }
      
      console.log("Rôle utilisateur:", profileData?.role, "Est admin:", isAdmin);
      
      return { isAdmin };
    } catch (error: any) {
      console.error("Erreur complète de connexion:", error);
      
      let errorMessage = "Email ou mot de passe incorrect.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    createAdminAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
