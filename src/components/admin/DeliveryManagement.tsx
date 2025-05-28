
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, MapPin, Phone } from 'lucide-react';

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
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type DeliveryPerson = {
  id: string;
  is_active: boolean | null;
  current_latitude: number | null;
  current_longitude: number | null;
  last_updated_position: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string;
};

const DeliveryManagement = () => {
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  useEffect(() => {
    fetchDeliveryPersonnel();
  }, []);

  const fetchDeliveryPersonnel = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          role,
          created_at,
          livreurs (
            is_active,
            current_latitude,
            current_longitude,
            last_updated_position
          )
        `)
        .eq('role', 'livreur')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Simulation d'emails pour l'affichage
      const deliveryPersons = data.map((person: any) => ({
        id: person.id,
        email: `livreur-${person.id.substring(0, 8)}@example.com`, // Simulation d'email
        first_name: person.first_name,
        last_name: person.last_name,
        phone: person.phone,
        is_active: person.livreurs?.[0]?.is_active || false,
        current_latitude: person.livreurs?.[0]?.current_latitude,
        current_longitude: person.livreurs?.[0]?.current_longitude,
        last_updated_position: person.livreurs?.[0]?.last_updated_position,
      }));

      setDeliveryPersonnel(deliveryPersons);
    } catch (error) {
      console.error('Erreur récupération livreurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des livreurs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Créer un nouvel utilisateur livreur
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: "livreur",
          },
        },
      });

      if (userError) throw userError;

      // Mettre à jour le profil du livreur avec le numéro de téléphone
      if (userData.user) {
        await supabase
          .from('profiles')
          .update({ phone: values.phone })
          .eq('id', userData.user.id);

        // Créer une entrée dans la table livreurs
        const { error: livreurError } = await supabase
          .from('livreurs')
          .insert([
            {
              id: userData.user.id,
              is_active: false,
              current_latitude: null,
              current_longitude: null,
            },
          ]);

        if (livreurError) throw livreurError;
      }

      toast({
        title: "Livreur créé",
        description: "Le compte livreur a été créé avec succès.",
      });
      
      setOpen(false);
      form.reset();
      fetchDeliveryPersonnel(); // Rafraîchir la liste des livreurs
    } catch (error: any) {
      console.error('Erreur création livreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte livreur.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des livreurs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un livreur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
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
                
                <Button type="submit" className="w-full">Créer le compte livreur</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Chargement des livreurs...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière position</TableHead>
                <TableHead>Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryPersonnel.length > 0 ? (
                deliveryPersonnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">
                      {person.first_name} {person.last_name}
                    </TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>
                      {person.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" /> {person.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        person.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {person.is_active ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {person.current_latitude && person.current_longitude ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> 
                          {person.current_latitude.toFixed(4)}, {person.current_longitude.toFixed(4)}
                        </div>
                      ) : (
                        <span className="text-gray-500">Non disponible</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {person.last_updated_position ? (
                        new Date(person.last_updated_position).toLocaleString()
                      ) : (
                        <span className="text-gray-500">Jamais</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucun livreur trouvé
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

export default DeliveryManagement;
