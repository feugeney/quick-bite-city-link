
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit, MapPin, Phone, Search } from 'lucide-react';
import LocationGetter from '@/components/LocationGetter';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  phone: z.string().optional(),
  owner_id: z.string().uuid({
    message: "ID propriétaire invalide",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  owner_id: string;
  created_at: string;
  owner_name?: string;
  coordinates?: {
    x: number;
    y: number;
  } | null;
};

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantOwners, setRestaurantOwners] = useState<{id: string, name: string}[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      owner_id: "",
    },
  });

  useEffect(() => {
    fetchRestaurants();
    fetchRestaurantOwners();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (restaurant.phone && restaurant.phone.includes(searchTerm)) ||
        (restaurant.owner_name && restaurant.owner_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          id, 
          name, 
          description, 
          address, 
          phone, 
          owner_id, 
          created_at,
          coordinates
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les noms des propriétaires
      const restaurantsWithOwners = await Promise.all(
        data.map(async (restaurant) => {
          try {
            const { data: ownerData, error: ownerError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', restaurant.owner_id)
              .single();

            if (ownerError) throw ownerError;

            // Transformer les coordonnées au format attendu ou null si non définies
            let formattedCoordinates = null;
            if (restaurant.coordinates) {
              const coords = restaurant.coordinates as any;
              if (typeof coords === 'object' && coords.x !== undefined && coords.y !== undefined) {
                formattedCoordinates = { x: coords.x, y: coords.y };
              }
            }

            return {
              ...restaurant,
              owner_name: ownerData ? `${ownerData.first_name} ${ownerData.last_name}` : 'Inconnu',
              coordinates: formattedCoordinates
            } as Restaurant;
          } catch (err) {
            console.error('Erreur récupération propriétaire:', err);
            return {
              ...restaurant,
              owner_name: 'Inconnu',
              coordinates: null
            } as Restaurant;
          }
        })
      );

      setRestaurants(restaurantsWithOwners);
      setFilteredRestaurants(restaurantsWithOwners);
    } catch (error) {
      console.error('Erreur récupération restaurants:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des restaurants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'restaurant');

      if (error) throw error;

      const owners = data.map(owner => ({
        id: owner.id,
        name: `${owner.first_name} ${owner.last_name}`,
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

  const handleLocationChange = (latitude: number, longitude: number) => {
    form.setValue('latitude', latitude);
    form.setValue('longitude', longitude);
    toast({
      title: "Position détectée",
      description: `Latitude: ${latitude}, Longitude: ${longitude}`,
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let point = null;
      
      if (values.latitude && values.longitude) {
        point = `(${values.longitude},${values.latitude})`;
      }
      
      if (editMode && values.id) {
        // Update existing restaurant
        const { error } = await supabase
          .from('restaurants')
          .update({
            name: values.name,
            description: values.description || null,
            address: values.address,
            phone: values.phone || null,
            owner_id: values.owner_id,
            coordinates: point ? point : null,
          })
          .eq('id', values.id);

        if (error) throw error;

        toast({
          title: "Restaurant mis à jour",
          description: "Le restaurant a été mis à jour avec succès.",
        });
      } else {
        // Create new restaurant
        const { data, error } = await supabase
          .from('restaurants')
          .insert({
            name: values.name,
            description: values.description || null,
            address: values.address,
            phone: values.phone || null,
            owner_id: values.owner_id,
            coordinates: point ? point : null,
          })
          .select();

        if (error) throw error;

        toast({
          title: "Restaurant créé",
          description: "Le restaurant a été créé avec succès.",
        });
      }
      
      setOpen(false);
      form.reset();
      fetchRestaurants(); // Refresh the restaurant list
      setEditMode(false);
    } catch (error: any) {
      console.error('Erreur création/mise à jour restaurant:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer/modifier le restaurant.",
        variant: "destructive",
      });
    }
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    form.reset({
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description || undefined,
      address: restaurant.address,
      phone: restaurant.phone || undefined,
      owner_id: restaurant.owner_id,
      latitude: restaurant.coordinates?.x || undefined,
      longitude: restaurant.coordinates?.y || undefined,
    });
    
    setEditMode(true);
    setOpen(true);
  };

  const handleOpenDialog = () => {
    form.reset({
      name: "",
      description: "",
      address: "",
      phone: "",
      owner_id: "",
    });
    setEditMode(false);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Gestion des restaurants</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>Ajouter un restaurant</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Modifier un restaurant" : "Ajouter un nouveau restaurant"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description du restaurant" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+224 00 00 00 00" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="owner_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Propriétaire</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Sélectionner un propriétaire</option>
                            {restaurantOwners.map((owner) => (
                              <option key={owner.id} value={owner.id}>
                                {owner.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              placeholder="Latitude" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              placeholder="Longitude" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <LocationGetter onLocationChange={handleLocationChange} />
                  
                  <Button type="submit" className="w-full">
                    {editMode ? "Mettre à jour" : "Créer le restaurant"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Chargement des restaurants...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">
                      {restaurant.name}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {restaurant.address}
                      {restaurant.coordinates && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({restaurant.coordinates.x.toFixed(4)}, {restaurant.coordinates.y.toFixed(4)})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {restaurant.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" /> {restaurant.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{restaurant.owner_name}</TableCell>
                    <TableCell>
                      {new Date(restaurant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditRestaurant(restaurant)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? "Aucun restaurant ne correspond à votre recherche" : "Aucun restaurant trouvé"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
