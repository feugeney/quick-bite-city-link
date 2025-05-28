
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle, Search, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Email invalide.",
  }),
  phone: z.string().optional(),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  role: z.enum(["client", "restaurant", "livreur", "admin"], {
    required_error: "Veuillez sélectionner un rôle.",
  }),
  restaurantId: z.string().optional(),
  restaurantName: z.string().optional(),
  restaurantAddress: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

type Restaurant = {
  id: string;
  name: string;
  address: string;
  owner_id: string;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [restaurantOption, setRestaurantOption] = useState<'existing' | 'new'>('existing');
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "client",
      restaurantId: "",
      restaurantName: "",
      restaurantAddress: "",
    },
  });

  const watchRole = form.watch("role");

  useEffect(() => {
    fetchUsers();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les utilisateurs via les profils
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          first_name, 
          last_name, 
          phone,
          role, 
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Simuler des emails pour l'affichage
      const usersWithData = data.map((user: any) => ({
        id: user.id,
        email: `utilisateur-${user.id.substring(0, 8)}@example.com`, // Simulation d'email
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      }));

      setUsers(usersWithData);
      setFilteredUsers(usersWithData);
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, address, owner_id');
      
      if (error) throw error;
      
      setRestaurants(data || []);
    } catch (error) {
      console.error('Erreur récupération restaurants:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des restaurants.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Créer un nouvel utilisateur
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: values.role,
          },
        },
      });

      if (userError) throw userError;

      // Mettre à jour le profil avec le numéro de téléphone si fourni
      if (userData.user && values.phone) {
        await supabase
          .from('profiles')
          .update({ phone: values.phone })
          .eq('id', userData.user.id);
      }

      // Si le rôle est livreur, créer une entrée dans la table livreurs
      if (values.role === "livreur" && userData.user) {
        await supabase
          .from('livreurs')
          .insert([
            {
              id: userData.user.id,
              is_active: false,
            },
          ]);
      }

      // Si le rôle est restaurant, associer/créer un restaurant
      if (values.role === "restaurant" && userData.user) {
        if (restaurantOption === 'existing' && values.restaurantId) {
          // Associer un restaurant existant au nouvel utilisateur
          const { error: updateError } = await supabase
            .from('restaurants')
            .update({ owner_id: userData.user.id })
            .eq('id', values.restaurantId);
            
          if (updateError) throw updateError;
        } else if (restaurantOption === 'new' && values.restaurantName && values.restaurantAddress) {
          // Créer un nouveau restaurant pour le nouvel utilisateur
          const { error: insertError } = await supabase
            .from('restaurants')
            .insert([
              {
                name: values.restaurantName,
                address: values.restaurantAddress,
                owner_id: userData.user.id,
              },
            ]);
            
          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès.",
      });
      
      setOpen(false);
      form.reset();
      fetchUsers(); // Rafraîchir la liste des utilisateurs
      fetchRestaurants(); // Rafraîchir la liste des restaurants
    } catch (error: any) {
      console.error('Erreur création utilisateur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'restaurant':
        return 'bg-blue-100 text-blue-800';
      case 'livreur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Gestion des utilisateurs</h2>
        
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
              <Button>Ajouter un utilisateur</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
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
                        <FormLabel>Téléphone (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="+224 00 00 00 00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                            <SelectItem value="livreur">Livreur</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Options spécifiques aux restaurants */}
                  {watchRole === "restaurant" && (
                    <div className="border rounded-md p-4 space-y-4">
                      <h3 className="font-medium">Configuration du restaurant</h3>
                      
                      <Tabs value={restaurantOption} onValueChange={(value) => setRestaurantOption(value as 'existing' | 'new')}>
                        <TabsList className="grid grid-cols-2 w-full">
                          <TabsTrigger value="existing">Restaurant existant</TabsTrigger>
                          <TabsTrigger value="new">Nouveau restaurant</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="existing" className="mt-4">
                          <FormField
                            control={form.control}
                            name="restaurantId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sélectionner un restaurant</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choisir un restaurant" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {restaurants.map((restaurant) => (
                                      <SelectItem key={restaurant.id} value={restaurant.id}>
                                        {restaurant.name} - {restaurant.address}
                                      </SelectItem>
                                    ))}
                                    {restaurants.length === 0 && (
                                      <div className="p-2 text-sm text-gray-500">
                                        Aucun restaurant disponible
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        
                        <TabsContent value="new" className="space-y-4 mt-4">
                          <FormField
                            control={form.control}
                            name="restaurantName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom du restaurant</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nom du restaurant" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="restaurantAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adresse</FormLabel>
                                <FormControl>
                                  <Input placeholder="Adresse complète" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">Créer l'utilisateur</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
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

export default UserManagement;
