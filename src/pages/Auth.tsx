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
import { Users, Truck, Store, User, Mail, Phone, MapPin, Upload, Camera, Building2, CreditCard, Lock, Star, Shield } from "lucide-react";

const Auth = () => {
  const { user, loading, signIn, createAdminAccount } = useAuth();
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
      description: "Commander des repas délicieux",
      color: "text-primary-500",
      bgColor: "hover:bg-primary-50 hover:border-primary-200 border-2",
      gradient: "from-primary-50 to-primary-100"
    },
    livreur: {
      icon: Truck,
      title: "Livreur",
      description: "Livrer avec NimbaExpress",
      color: "text-accent-500", 
      bgColor: "hover:bg-accent-50 hover:border-accent-200 border-2",
      gradient: "from-accent-50 to-accent-100"
    },
    restaurant_owner: {
      icon: Store,
      title: "Propriétaire",
      description: "Développer votre restaurant",
      color: "text-secondary-600",
      bgColor: "hover:bg-secondary-50 hover:border-secondary-200 border-2",
      gradient: "from-secondary-50 to-secondary-100"
    }
  };

  return (
    <div className="min-h-screen bg-guinea-subtle guinea-pattern relative overflow-hidden">
      {/* Motifs décoratifs - optimisés pour mobile */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-4 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-secondary-100 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-accent-100 rounded-full opacity-25 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center py-4 sm:py-8 px-3 sm:px-4 lg:px-8 min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo et titre avec design guinéen - responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl relative">
                <span className="text-white font-bold text-2xl sm:text-3xl">N</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-secondary-400 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-guinea mb-2 sm:mb-3">NimbaExpress</h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium px-2">La saveur de la Guinée à votre porte</p>
            <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-secondary-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent-500 rounded-full"></div>
            </div>
          </div>

          {/* Bouton admin - responsive */}
          <div className="text-center mb-4 sm:mb-6 px-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={createAdminAccount}
              className="text-xs bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 rounded-xl mb-2 px-4 py-2"
            >
              <Shield className="w-3 h-3 mr-2" />
              Créer compte administrateur
            </Button>
            <div className="text-xs text-gray-500 px-2 leading-relaxed">
              Email: admin@nimbaexpress.com<br />
              Mot de passe: AdminNimba2024!
            </div>
          </div>

          {/* Tabs avec design guinéen - responsive */}
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            if (value === "register") {
              resetRegistrationForm();
            }
          }} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-white/30">
              <TabsTrigger value="login" className="rounded-lg sm:rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold text-sm">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg sm:rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold text-sm">
                Inscription
              </TabsTrigger>
            </TabsList>

            {/* Connexion - responsive */}
            <TabsContent value="login">
              <Card className="card-guinea border-0 shadow-2xl">
                <CardHeader className="space-y-1 pb-4 sm:pb-6 text-center px-4 sm:px-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Bon retour !</CardTitle>
                  <CardDescription className="text-gray-600 text-base sm:text-lg">
                    Connectez-vous pour savourer nos délices
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="exemple@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary-400 text-base sm:text-lg"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
                        <Button variant="link" className="px-0 font-medium text-primary-600 hover:text-primary-700 text-xs sm:text-sm">
                          Mot de passe oublié?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                        <Input
                          id="password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary-400 text-base sm:text-lg"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 sm:px-6">
                    <Button
                      type="submit"
                      className="w-full btn-guinea h-12 sm:h-14 text-base sm:text-lg"
                      disabled={loginLoading}
                    >
                      {loginLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Inscription - responsive */}
            <TabsContent value="register">
              <Card className="card-guinea border-0 shadow-2xl">
                <CardHeader className="space-y-1 pb-4 sm:pb-6 text-center px-4 sm:px-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Rejoignez-nous</CardTitle>
                  <CardDescription className="text-gray-600 text-base sm:text-lg">
                    {selectedRole ? 
                      `Inscription en tant que ${roleConfig[selectedRole].title}` :
                      'Choisissez votre aventure culinaire'
                    }
                  </CardDescription>
                </CardHeader>
                
                {!selectedRole ? (
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        Rejoignez la famille NimbaExpress
                      </h3>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {Object.entries(roleConfig).map(([role, config]) => {
                        const Icon = config.icon;
                        return (
                          <Button
                            key={role}
                            variant="outline"
                            className={`w-full h-16 sm:h-20 flex items-center justify-start space-x-4 sm:space-x-6 ${config.bgColor} transition-all duration-300 hover:scale-105 p-3 sm:p-4`}
                            onClick={() => setSelectedRole(role as any)}
                          >
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.gradient} ${config.color} shadow-lg`}>
                              <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-base sm:text-lg text-gray-900">{config.title}</div>
                              <div className="text-sm text-gray-600">{config.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                ) : (
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 max-h-[60vh] overflow-y-auto">
                      {/* Header avec rôle sélectionné - responsive */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-gray-200">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${roleConfig[selectedRole].gradient} ${roleConfig[selectedRole].color} shadow-lg`}>
                            {React.createElement(roleConfig[selectedRole].icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
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

                      {/* Champs du formulaire - responsive */}
                      <div className="space-y-3 sm:space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="registerEmail" className="text-sm font-semibold text-gray-700">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                            <Input
                              id="registerEmail"
                              type="email"
                              placeholder="exemple@email.com"
                              value={registerData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-primary-400 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="registerPassword" className="text-sm font-semibold text-gray-700">Mot de passe *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                            <Input
                              id="registerPassword"
                              type="password"
                              placeholder="Minimum 8 caractères"
                              value={registerData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-primary-400 text-sm sm:text-base"
                              required
                              minLength={8}
                            />
                          </div>
                        </div>

                        {/* Téléphone */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">Téléphone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={registerData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+224 000 00 00 00"
                              className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        {/* Nom et Prénom - responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">Prénom *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="firstName"
                                value={registerData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">Nom *</Label>
                            <Input
                              id="lastName"
                              value={registerData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        {/* Champs conditionnels selon le rôle - responsive */}
                        {selectedRole !== 'client' && (
                          <>
                            {/* Numéro d'identification */}
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="idNumber" className="text-sm font-medium">Numéro d'identification *</Label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="idNumber"
                                  value={registerData.idNumber}
                                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                                  placeholder="Numéro de pièce d'identité"
                                  className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                  required
                                />
                              </div>
                            </div>

                            {/* Photo de la pièce d'identité - responsive */}
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-sm font-medium">Photo de la pièce d'identité *</Label>
                              <div className="flex items-center justify-center w-full">
                                <label htmlFor="idCardPhoto" className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-3 sm:pb-6">
                                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500" />
                                    <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
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
                                <p className="text-xs sm:text-sm text-green-600">Fichier sélectionné: {registerData.idCardPhoto.name}</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Champs spécifiques aux livreurs - responsive */}
                        {selectedRole === 'livreur' && (
                          <>
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="address" className="text-sm font-medium">Adresse *</Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="address"
                                  value={registerData.address}
                                  onChange={(e) => handleInputChange('address', e.target.value)}
                                  className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="vehicleType" className="text-sm font-medium">Type de véhicule *</Label>
                              <Select value={registerData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                                <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base">
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

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-sm font-medium">Photo de profil *</Label>
                              <div className="flex items-center justify-center w-full">
                                <label htmlFor="profilePhoto" className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-3 sm:pb-6">
                                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500" />
                                    <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
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
                                <p className="text-xs sm:text-sm text-green-600">Fichier sélectionné: {registerData.profilePhoto.name}</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Champs spécifiques aux propriétaires - responsive */}
                        {selectedRole === 'restaurant_owner' && (
                          <>
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="restaurantName" className="text-sm font-medium">Nom du restaurant *</Label>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="restaurantName"
                                  value={registerData.restaurantName}
                                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                                  className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="restaurantAddress" className="text-sm font-medium">Adresse du restaurant *</Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="restaurantAddress"
                                  value={registerData.restaurantAddress}
                                  onChange={(e) => handleInputChange('restaurantAddress', e.target.value)}
                                  className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="restaurantType" className="text-sm font-medium">Type de cuisine *</Label>
                              <Select value={registerData.restaurantType} onValueChange={(value) => handleInputChange('restaurantType', value)}>
                                <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base">
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

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="restaurantDescription" className="text-sm font-medium">Description</Label>
                              <Textarea
                                id="restaurantDescription"
                                value={registerData.restaurantDescription}
                                onChange={(e) => handleInputChange('restaurantDescription', e.target.value)}
                                placeholder="Décrivez votre restaurant..."
                                className="rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                                rows={2}
                              />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-sm font-medium">Logo/Photo du restaurant</Label>
                              <div className="flex items-center justify-center w-full">
                                <label htmlFor="restaurantLogo" className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-3 sm:pb-6">
                                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500" />
                                    <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
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
                                <p className="text-xs sm:text-sm text-green-600">Fichier sélectionné: {registerData.restaurantLogo.name}</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Messages informatifs selon le rôle - responsive */}
                        {selectedRole === 'client' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm">Information client</h4>
                            <p className="text-blue-800 text-xs sm:text-sm">
                              Vous pourrez commander des repas dès votre inscription confirmée.
                            </p>
                          </div>
                        )}

                        {selectedRole === 'livreur' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <h4 className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm">Information livreur</h4>
                            <p className="text-green-800 text-xs sm:text-sm">
                              Après votre inscription, votre profil sera vérifié par notre équipe avant d'être approuvé.
                            </p>
                          </div>
                        )}

                        {selectedRole === 'restaurant_owner' && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <h4 className="font-semibold text-orange-900 mb-1 sm:mb-2 text-sm">Information propriétaire</h4>
                            <p className="text-orange-800 text-xs sm:text-sm">
                              Votre restaurant sera vérifié par notre équipe avant d'être publié sur la plateforme.
                            </p>
                          </div>
                        )}
                      </div>
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
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
