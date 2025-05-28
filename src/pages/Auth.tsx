
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Users, Truck, Store, User, Mail, Phone, MapPin, Upload, Camera, Building2, CreditCard, Lock } from "lucide-react";

const Auth = () => {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  
  // Utiliser le paramètre d'URL pour définir l'onglet actif
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === "register" ? "register" : "login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [selectedRole, setSelectedRole] = useState<'client' | 'livreur' | 'restaurant_owner' | null>(null);
  const [registerData, setRegisterData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "", // Ajout du mot de passe
    // Restaurant owner specific
    restaurantName: "",
    restaurantAddress: "",
    restaurantType: "",
    restaurantDescription: "",
    restaurantLogo: null as File | null,
    // Delivery person specific
    vehicleType: "",
    address: "",
    // Common for livreur and restaurant_owner
    idNumber: "",
    idCardPhoto: null as File | null,
    profilePhoto: null as File | null
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      const { isAdmin } = await signIn(loginEmail, loginPassword);
      
      // Redirect based on user role
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
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

      setActiveTab("login");
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

  const createAdminAccount = async () => {
    try {
      const adminEmail = "admin@nimbaexpress.com";
      const adminPassword = "AdminNimba2024!";
      
      console.log("Vérification/création du compte admin...");
      
      // D'abord, vérifier si l'utilisateur existe déjà dans auth.users
      const { data: existingUserData } = await supabase.auth.admin.listUsers();
      const existingUser = existingUserData.users?.find(user => user.email === adminEmail);
      
      if (existingUser) {
        console.log("Utilisateur admin existe déjà, mise à jour du profil...");
        
        // Vérifier/créer le profil admin
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', existingUser.id)
          .maybeSingle();
          
        if (!existingProfile) {
          // Créer le profil s'il n'existe pas
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: existingUser.id,
              role: 'admin',
              first_name: 'Super',
              last_name: 'Admin'
            });
            
          if (profileError) {
            console.error('Erreur création profil:', profileError);
          }
        } else if (existingProfile.role !== 'admin') {
          // Mettre à jour le rôle si nécessaire
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', existingUser.id);
            
          if (updateError) {
            console.error('Erreur mise à jour rôle:', updateError);
          }
        }
        
        toast({
          title: "Compte administrateur prêt",
          description: `Utilisez: ${adminEmail} | ${adminPassword}`,
          duration: 8000,
        });
        return;
      }
      
      // Si l'utilisateur n'existe pas, le créer
      console.log("Création d'un nouvel utilisateur admin...");
      
      // Utiliser admin.createUser pour éviter les problèmes d'email
      const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          first_name: 'Super',
          last_name: 'Admin',
          role: 'admin'
        }
      });

      if (createError) {
        console.error("Erreur création utilisateur admin:", createError);
        throw createError;
      }

      console.log("Utilisateur admin créé avec succès:", newUserData);

      if (newUserData.user) {
        // S'assurer que le profil est créé avec le bon rôle
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: newUserData.user.id,
            role: 'admin',
            first_name: 'Super',
            last_name: 'Admin'
          });

        if (profileError) {
          console.error('Erreur création/mise à jour profil:', profileError);
        } else {
          console.log("Profil admin créé avec succès");
        }
      }

      toast({
        title: "Compte administrateur créé",
        description: `Email: ${adminEmail} | Mot de passe: ${adminPassword}`,
        duration: 10000,
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

  // If user is already logged in, redirect to home page
  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  const roleConfig = {
    client: {
      icon: Users,
      title: "Client",
      description: "Commander des repas",
      color: "text-blue-500",
      bgColor: "hover:bg-blue-50 hover:border-blue-500",
    },
    livreur: {
      icon: Truck,
      title: "Livreur",
      description: "Livrer des commandes",
      color: "text-green-500", 
      bgColor: "hover:bg-green-50 hover:border-green-500",
    },
    restaurant_owner: {
      icon: Store,
      title: "Propriétaire",
      description: "Gérer un restaurant",
      color: "text-orange-500",
      bgColor: "hover:bg-orange-50 hover:border-orange-500", 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NimbaExpress</h1>
          <p className="text-gray-600">Livraison de repas rapide à Conakry</p>
        </div>

        {/* Bouton admin en mode développement */}
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={createAdminAccount}
            className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
          >
            Créer/Vérifier compte administrateur
          </Button>
          <div className="mt-2 text-xs text-gray-500">
            Email: admin@nimbaexpress.com | Mot de passe: AdminNimba2024!
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === "register") {
            resetRegistrationForm();
          }
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="login" className="rounded-lg">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg">Inscription</TabsTrigger>
          </TabsList>

          {/* Connexion */}
          <TabsContent value="login">
            <Card className="border-0 shadow-xl rounded-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center">Bon retour !</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Connectez-vous à votre compte pour continuer
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                      <Button variant="link" className="px-0 font-normal text-green-600 hover:text-green-700">
                        Mot de passe oublié?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-green-500"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl h-12"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Inscription */}
          <TabsContent value="register">
            <Card className="border-0 shadow-xl rounded-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  {selectedRole ? 
                    `Inscription en tant que ${roleConfig[selectedRole].title}` :
                    'Choisissez votre type de compte'
                  }
                </CardDescription>
              </CardHeader>
              
              {!selectedRole ? (
                <CardContent className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Rejoignez NimbaExpress en tant que :
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(roleConfig).map(([role, config]) => {
                      const Icon = config.icon;
                      return (
                        <Button
                          key={role}
                          variant="outline"
                          className={`w-full h-16 flex items-center justify-start space-x-4 border-2 rounded-xl ${config.bgColor} transition-all duration-200`}
                          onClick={() => setSelectedRole(role as any)}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${config.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{config.title}</div>
                            <div className="text-sm text-gray-500">{config.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    {/* Header avec rôle sélectionné */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white ${roleConfig[selectedRole].color}`}>
                          {React.createElement(roleConfig[selectedRole].icon, { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{roleConfig[selectedRole].title}</div>
                          <div className="text-sm text-gray-500">{roleConfig[selectedRole].description}</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRole(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Changer
                      </Button>
                    </div>

                    {/* Email - Pour tous les rôles */}
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail" className="text-sm font-medium">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="exemple@email.com"
                          value={registerData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Mot de passe - Pour tous les rôles */}
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword" className="text-sm font-medium">Mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="registerPassword"
                          type="password"
                          placeholder="Minimum 8 caractères"
                          value={registerData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    {/* Téléphone - Pour tous les rôles */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={registerData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+224 000 00 00 00"
                          className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Nom et Prénom - Pour clients aussi maintenant */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">Prénom *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            value={registerData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">Nom *</Label>
                        <Input
                          id="lastName"
                          value={registerData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="rounded-xl border-gray-200 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Champs pour livreur et propriétaire uniquement */}
                    {selectedRole !== 'client' && (
                      <>
                        {/* Numéro d'identification */}
                        <div className="space-y-2">
                          <Label htmlFor="idNumber" className="text-sm font-medium">Numéro d'identification *</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="idNumber"
                              value={registerData.idNumber}
                              onChange={(e) => handleInputChange('idNumber', e.target.value)}
                              placeholder="Numéro de pièce d'identité"
                              className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Photo de la pièce d'identité */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Photo de la pièce d'identité *</Label>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="idCardPhoto" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Cliquez pour uploader</span>
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                              </div>
                              <input
                                id="idCardPhoto"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange('idCardPhoto', e.target.files?.[0] || null)}
                                required
                              />
                            </label>
                          </div>
                          {registerData.idCardPhoto && (
                            <p className="text-sm text-green-600">Fichier sélectionné: {registerData.idCardPhoto.name}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Champs spécifiques aux livreurs */}
                    {selectedRole === 'livreur' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm font-medium">Adresse *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="address"
                              value={registerData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="vehicleType" className="text-sm font-medium">Type de véhicule *</Label>
                          <Select value={registerData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-green-500">
                              <SelectValue placeholder="Type de véhicule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="moto">Moto</SelectItem>
                              <SelectItem value="scooter">Scooter</SelectItem>
                              <SelectItem value="velo">Vélo</SelectItem>
                              <SelectItem value="voiture">Voiture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Photo de profil *</Label>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="profilePhoto" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Cliquez pour uploader</span>
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                              </div>
                              <input
                                id="profilePhoto"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                                required
                              />
                            </label>
                          </div>
                          {registerData.profilePhoto && (
                            <p className="text-sm text-green-600">Fichier sélectionné: {registerData.profilePhoto.name}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Champs spécifiques aux propriétaires */}
                    {selectedRole === 'restaurant_owner' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="restaurantName" className="text-sm font-medium">Nom du restaurant *</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="restaurantName"
                              value={registerData.restaurantName}
                              onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                              className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="restaurantAddress" className="text-sm font-medium">Adresse du restaurant *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="restaurantAddress"
                              value={registerData.restaurantAddress}
                              onChange={(e) => handleInputChange('restaurantAddress', e.target.value)}
                              className="pl-10 rounded-xl border-gray-200 focus:border-green-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="restaurantType" className="text-sm font-medium">Type de cuisine *</Label>
                          <Select value={registerData.restaurantType} onValueChange={(value) => handleInputChange('restaurantType', value)}>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-green-500">
                              <SelectValue placeholder="Type de cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="africaine">Africaine</SelectItem>
                              <SelectItem value="francaise">Française</SelectItem>
                              <SelectItem value="italienne">Italienne</SelectItem>
                              <SelectItem value="libanaise">Libanaise</SelectItem>
                              <SelectItem value="chinoise">Chinoise</SelectItem>
                              <SelectItem value="fast-food">Fast Food</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="restaurantDescription" className="text-sm font-medium">Description</Label>
                          <Textarea
                            id="restaurantDescription"
                            value={registerData.restaurantDescription}
                            onChange={(e) => handleInputChange('restaurantDescription', e.target.value)}
                            placeholder="Décrivez votre restaurant..."
                            className="rounded-xl border-gray-200 focus:border-green-500"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Logo/Photo du restaurant</Label>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="restaurantLogo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Cliquez pour uploader</span>
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                              </div>
                              <input
                                id="restaurantLogo"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange('restaurantLogo', e.target.files?.[0] || null)}
                              />
                            </label>
                          </div>
                          {registerData.restaurantLogo && (
                            <p className="text-sm text-green-600">Fichier sélectionné: {registerData.restaurantLogo.name}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Message informatif selon le rôle */}
                    {selectedRole === 'client' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Information client</h4>
                        <p className="text-blue-800 text-sm">
                          Vous pourrez commander des repas dès votre inscription confirmée.
                        </p>
                      </div>
                    )}

                    {selectedRole === 'livreur' && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Information livreur</h4>
                        <p className="text-green-800 text-sm">
                          Après votre inscription, votre profil sera vérifié par notre équipe avant d'être approuvé.
                        </p>
                      </div>
                    )}

                    {selectedRole === 'restaurant_owner' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Information propriétaire</h4>
                        <p className="text-orange-800 text-sm">
                          Votre restaurant sera vérifié par notre équipe avant d'être publié sur la plateforme.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl h-12"
                      disabled={registerLoading || uploading}
                    >
                      {registerLoading || uploading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
