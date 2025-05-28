
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';
import { Upload, Car, User, IdCard, MapPin, Phone, Camera } from 'lucide-react';

const DeliveryRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    nationalIdNumber: '',
    address: '',
    phoneNumber: '',
    idCardImage: null as File | null,
    profilePhoto: null as File | null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const checkExistingProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('delivery_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing profile:', error);
          return;
        }

        if (data) {
          setExistingProfile(data);
          setFormData({
            nationalIdNumber: data.national_id_number || '',
            address: data.address || '',
            phoneNumber: data.phone_number || '',
            idCardImage: null,
            profilePhoto: null,
          });
        }
      } catch (error) {
        console.error('Error checking existing profile:', error);
      }
    };

    checkExistingProfile();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'idCardImage' | 'profilePhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour vous inscrire comme livreur.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let idCardImageUrl = existingProfile?.id_card_image_url;
      let profilePhotoUrl = existingProfile?.profile_photo_url;

      // Upload ID card image if provided
      if (formData.idCardImage) {
        const idCardPath = `id-cards/${user.id}-${Date.now()}`;
        idCardImageUrl = await uploadFile(formData.idCardImage, 'delivery-documents', idCardPath);
      }

      // Upload profile photo if provided
      if (formData.profilePhoto) {
        const photoPath = `profile-photos/${user.id}-${Date.now()}`;
        profilePhotoUrl = await uploadFile(formData.profilePhoto, 'delivery-documents', photoPath);
      }

      const profileData = {
        user_id: user.id,
        national_id_number: formData.nationalIdNumber,
        address: formData.address,
        phone_number: formData.phoneNumber,
        id_card_image_url: idCardImageUrl,
        profile_photo_url: profilePhotoUrl,
        status: existingProfile ? existingProfile.status : 'pending'
      };

      if (existingProfile) {
        const { error } = await supabase
          .from('delivery_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Profil mis à jour",
          description: "Votre profil de livreur a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('delivery_profiles')
          .insert([profileData]);

        if (error) throw error;

        toast({
          title: "Inscription réussie",
          description: "Votre demande d'inscription comme livreur a été soumise. Nous examinerons votre dossier sous peu.",
        });
      }

      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting delivery registration:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {existingProfile ? 'Modifier mon profil livreur' : 'Devenir livreur NimbaExpress'}
          </h1>
          <p className="text-lg text-gray-600">
            {existingProfile ? 'Mettez à jour vos informations de livreur' : 'Rejoignez notre équipe de livreurs et commencez à gagner de l\'argent'}
          </p>
          
          {existingProfile && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4 ${getStatusColor(existingProfile.status)}`}>
              Statut: {getStatusText(existingProfile.status)}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nationalIdNumber" className="flex items-center">
                    <IdCard className="w-4 h-4 mr-2" />
                    Numéro d'identité nationale *
                  </Label>
                  <Input
                    id="nationalIdNumber"
                    name="nationalIdNumber"
                    value={formData.nationalIdNumber}
                    onChange={handleInputChange}
                    placeholder="Votre numéro d'identité nationale"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+224 000 00 00 00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Adresse complète *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Votre adresse complète"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <IdCard className="w-4 h-4 mr-2" />
                    Pièce d'identité (photo) {!existingProfile && '*'}
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="idCardImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour uploader</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                      </div>
                      <input
                        id="idCardImage"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idCardImage')}
                        required={!existingProfile}
                      />
                    </label>
                  </div>
                  {formData.idCardImage && (
                    <p className="text-sm text-green-600">Fichier sélectionné: {formData.idCardImage.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo de profil {!existingProfile && '*'}
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="profilePhoto" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
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
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                        required={!existingProfile}
                      />
                    </label>
                  </div>
                  {formData.profilePhoto && (
                    <p className="text-sm text-green-600">Fichier sélectionné: {formData.profilePhoto.name}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Information importante</h3>
                <p className="text-blue-800 text-sm">
                  Votre demande sera examinée par notre équipe. Vous recevrez une notification une fois votre profil approuvé. 
                  Assurez-vous que toutes les informations sont correctes et que les photos sont claires et lisibles.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={loading}
              >
                {loading ? 'En cours...' : existingProfile ? 'Mettre à jour mon profil' : 'Soumettre ma candidature'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default DeliveryRegistration;
