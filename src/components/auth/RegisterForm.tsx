
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import RoleSelector from './RoleSelector';
import RegistrationFields from './RegistrationFields';

type Role = 'client' | 'livreur' | 'restaurant_owner';

const RegisterForm = () => {
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [registerData, setRegisterData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
    restaurantName: "",
    restaurantAddress: "",
    restaurantType: "",
    restaurantDescription: "",
    restaurantLogo: null as File | null,
    vehicleType: "",
    address: "",
    idNumber: "",
    idCardPhoto: null as File | null,
    profilePhoto: null as File | null
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const roleConfig = {
    client: {
      icon: 'Users',
      title: "Client",
      description: "Commander des repas délicieux",
      color: "text-primary-500",
      bgColor: "hover:bg-primary-50 hover:border-primary-200 border-2",
      gradient: "from-primary-50 to-primary-100"
    },
    livreur: {
      icon: 'Truck',
      title: "Livreur",
      description: "Livrer avec NimbaExpress",
      color: "text-accent-500", 
      bgColor: "hover:bg-accent-50 hover:border-accent-200 border-2",
      gradient: "from-accent-50 to-accent-100"
    },
    restaurant_owner: {
      icon: 'Store',
      title: "Propriétaire",
      description: "Développer votre restaurant",
      color: "text-secondary-600",
      bgColor: "hover:bg-secondary-50 hover:border-secondary-200 border-2",
      gradient: "from-secondary-50 to-secondary-100"
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setRegisterLoading(true);

      if (selectedRole === 'client') {
        // Pour les clients, créer un compte avec mot de passe
        const { error: signUpError } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            data: {
              first_name: registerData.firstName,
              last_name: registerData.lastName,
              role: 'client',
              phone: registerData.phone
            }
          }
        });

        if (signUpError) throw signUpError;

        toast({
          title: "Inscription réussie",
          description: "Votre compte client a été créé. Vous pouvez maintenant vous connecter.",
        });
      } else {
        // Pour livreurs et propriétaires, créer une demande
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            data: {
              first_name: registerData.firstName,
              last_name: registerData.lastName,
              role: 'client' // Role temporaire en attendant l'approbation
            }
          }
        });

        if (signUpError) throw signUpError;

        if (userData.user) {
          // Upload des fichiers
          let idCardUrl = null;
          let profilePhotoUrl = null;
          let logoUrl = null;

          if (registerData.idCardPhoto) {
            idCardUrl = await uploadFile(registerData.idCardPhoto, 'id-cards');
          }

          if (selectedRole === 'livreur' && registerData.profilePhoto) {
            profilePhotoUrl = await uploadFile(registerData.profilePhoto, 'profile-photos');
          }

          if (selectedRole === 'restaurant_owner' && registerData.restaurantLogo) {
            logoUrl = await uploadFile(registerData.restaurantLogo, 'restaurant-logos');
          }

          if (selectedRole === 'livreur') {
            // Créer une demande de livreur
            const { error } = await supabase
              .from('delivery_applications')
              .insert({
                user_id: userData.user.id,
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                phone: registerData.phone,
                address: registerData.address,
                id_number: registerData.idNumber,
                vehicle_type: registerData.vehicleType,
                id_card_photo_url: idCardUrl,
                profile_photo_url: profilePhotoUrl
              });

            if (error) throw error;
          } else if (selectedRole === 'restaurant_owner') {
            // Créer une demande de propriétaire
            const { error } = await supabase
              .from('restaurant_applications')
              .insert({
                user_id: userData.user.id,
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                phone: registerData.phone,
                id_number: registerData.idNumber,
                id_card_photo_url: idCardUrl,
                restaurant_name: registerData.restaurantName,
                restaurant_address: registerData.restaurantAddress,
                restaurant_type: registerData.restaurantType,
                restaurant_description: registerData.restaurantDescription,
                restaurant_logo_url: logoUrl
              });

            if (error) throw error;
          }

          toast({
            title: "Demande soumise",
            description: "Votre demande d'inscription a été soumise. Elle sera examinée par notre équipe.",
          });
        }
      }

      resetRegistrationForm();
    } catch (error: any) {
      console.error("Register error:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const resetRegistrationForm = () => {
    setSelectedRole(null);
    setRegisterData({
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
      restaurantName: "",
      restaurantAddress: "",
      restaurantType: "",
      restaurantDescription: "",
      restaurantLogo: null,
      vehicleType: "",
      address: "",
      idNumber: "",
      idCardPhoto: null,
      profilePhoto: null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setRegisterData(prev => ({ ...prev, [field]: file }));
  };

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={setSelectedRole} />;
  }

  return (
    <Card className="card-guinea border-0 shadow-2xl">
      <CardHeader className="space-y-1 pb-4 sm:pb-6 text-center px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Rejoignez-nous</CardTitle>
        <CardDescription className="text-gray-600 text-base sm:text-lg">
          Inscription en tant que {roleConfig[selectedRole].title}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 max-h-[60vh] overflow-y-auto">
          {/* Header avec rôle sélectionné - responsive */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-gray-200">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${roleConfig[selectedRole].gradient} ${roleConfig[selectedRole].color} shadow-lg`}>
                <span className="text-lg font-bold">{roleConfig[selectedRole].icon.charAt(0)}</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm sm:text-base">{roleConfig[selectedRole].title}</div>
                <div className="text-xs sm:text-sm text-gray-600">{roleConfig[selectedRole].description}</div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRole(null)}
              className="text-gray-500 hover:text-gray-700 rounded-lg sm:rounded-xl text-xs"
            >
              Changer
            </Button>
          </div>

          <RegistrationFields
            selectedRole={selectedRole}
            registerData={registerData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
          />
        </CardContent>
        <CardFooter className="px-4 sm:px-6">
          <Button
            type="submit"
            className="w-full btn-guinea h-12 sm:h-14 text-base sm:text-lg"
            disabled={registerLoading || uploading}
          >
            {registerLoading || uploading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
