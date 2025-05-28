
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Save, User } from 'lucide-react';

interface RestaurantCreationFormProps {
  onRestaurantCreated: (restaurantId: string) => void;
  allowOwnerSelection?: boolean; // New prop to control if owner can be selected
}

interface RestaurantOwner {
  id: string;
  name: string;
}

const RestaurantCreationForm = ({ 
  onRestaurantCreated, 
  allowOwnerSelection = false 
}: RestaurantCreationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [restaurantOwners, setRestaurantOwners] = useState<RestaurantOwner[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    owner_id: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (allowOwnerSelection) {
      fetchRestaurantOwners();
    } else if (user) {
      // Auto-set current user as owner if not allowing selection
      setFormData(prev => ({ ...prev, owner_id: user.id }));
    }
  }, [allowOwnerSelection, user]);

  const fetchRestaurantOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'restaurant');

      if (error) throw error;

      const owners = data.map(owner => ({
        id: owner.id,
        name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || 'Nom non défini',
      }));

      setRestaurantOwners(owners);
    } catch (error) {
      console.error('Erreur récupération propriétaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des propriétaires.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast({
        title: "Erreur",
        description: "Le nom et l'adresse sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (!formData.owner_id) {
      toast({
        title: "Erreur",
        description: "Un propriétaire doit être sélectionné",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          name: formData.name,
          description: formData.description || null,
          address: formData.address,
          phone: formData.phone || null,
          owner_id: formData.owner_id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Restaurant créé avec succès !",
      });

      onRestaurantCreated(data.id);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le restaurant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Créer votre restaurant
          </CardTitle>
          <p className="text-muted-foreground">
            Configurez les informations de base de votre restaurant pour commencer.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nom du restaurant *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom de votre restaurant"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse complète"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+224 XX XX XX XX"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre restaurant..."
                rows={4}
              />
            </div>

            {allowOwnerSelection && (
              <div>
                <Label htmlFor="owner_id" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Propriétaire *
                </Label>
                <select
                  id="owner_id"
                  value={formData.owner_id}
                  onChange={(e) => handleInputChange('owner_id', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Sélectionner un propriétaire</option>
                  {restaurantOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.address || !formData.owner_id}
              className="w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer le restaurant
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantCreationForm;
