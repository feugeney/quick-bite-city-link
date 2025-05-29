
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, Phone, User, MapPin, CreditCard, Upload, Camera, Building2 } from 'lucide-react';

type Role = 'client' | 'livreur' | 'restaurant_owner';

interface RegisterData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantType: string;
  restaurantDescription: string;
  restaurantLogo: File | null;
  vehicleType: string;
  address: string;
  idNumber: string;
  idCardPhoto: File | null;
  profilePhoto: File | null;
}

interface RegistrationFieldsProps {
  selectedRole: Role;
  registerData: RegisterData;
  onInputChange: (field: string, value: string) => void;
  onFileChange: (field: string, file: File | null) => void;
}

const RegistrationFields = ({ selectedRole, registerData, onInputChange, onFileChange }: RegistrationFieldsProps) => {
  return (
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
            onChange={(e) => onInputChange('email', e.target.value)}
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
            onChange={(e) => onInputChange('password', e.target.value)}
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
            onChange={(e) => onInputChange('phone', e.target.value)}
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
              onChange={(e) => onInputChange('firstName', e.target.value)}
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
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
                onChange={(e) => onInputChange('idNumber', e.target.value)}
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
                  onChange={(e) => onFileChange('idCardPhoto', e.target.files?.[0] || null)}
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
                onChange={(e) => onInputChange('address', e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="vehicleType" className="text-sm font-medium">Type de véhicule *</Label>
            <Select value={registerData.vehicleType} onValueChange={(value) => onInputChange('vehicleType', value)}>
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
                  onChange={(e) => onFileChange('profilePhoto', e.target.files?.[0] || null)}
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
                onChange={(e) => onInputChange('restaurantName', e.target.value)}
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
                onChange={(e) => onInputChange('restaurantAddress', e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="restaurantType" className="text-sm font-medium">Type de cuisine *</Label>
            <Select value={registerData.restaurantType} onValueChange={(value) => onInputChange('restaurantType', value)}>
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
              onChange={(e) => onInputChange('restaurantDescription', e.target.value)}
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
                  onChange={(e) => onFileChange('restaurantLogo', e.target.files?.[0] || null)}
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
  );
};

export default RegistrationFields;
