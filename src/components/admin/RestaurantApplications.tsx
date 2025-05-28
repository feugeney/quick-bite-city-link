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
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, Phone, MapPin } from 'lucide-react';

type RestaurantApplication = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  id_number: string;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_type: string;
  restaurant_description: string | null;
  status: string;
  created_at: string;
  restaurant_logo_url: string | null;
  id_card_photo_url: string | null;
};

const RestaurantApplications = () => {
  const [applications, setApplications] = useState<RestaurantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<RestaurantApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('restaurant_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Erreur récupération demandes restaurant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de restaurant.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: RestaurantApplication) => {
    try {
      // Mettre à jour le statut de la demande
      const { error: updateError } = await supabase
        .from('restaurant_applications')
        .update({ status: 'approved' })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Mettre à jour le rôle de l'utilisateur
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'restaurant' })
        .eq('id', application.user_id);

      if (roleError) throw roleError;

      // Créer le restaurant
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: application.restaurant_name,
          description: application.restaurant_description,
          address: application.restaurant_address,
          phone: application.phone,
          owner_id: application.user_id,
          image_url: application.restaurant_logo_url,
        });

      if (restaurantError) throw restaurantError;

      toast({
        title: "Demande approuvée",
        description: "La demande de restaurant a été approuvée avec succès.",
      });

      fetchApplications();
    } catch (error: any) {
      console.error('Erreur approbation demande:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver la demande.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande de restaurant a été rejetée.",
      });

      fetchApplications();
    } catch (error: any) {
      console.error('Erreur rejet demande:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter la demande.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <p>Chargement des demandes de restaurant...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Demandes de création de restaurant</h2>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Demandeur</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date demande</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{application.first_name} {application.last_name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {application.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.restaurant_name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {application.restaurant_address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.restaurant_type}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Détails de la demande</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Informations du demandeur</h4>
                                <p><strong>Nom:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</p>
                                <p><strong>Téléphone:</strong> {selectedApplication.phone}</p>
                                <p><strong>ID:</strong> {selectedApplication.id_number}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Informations du restaurant</h4>
                                <p><strong>Nom:</strong> {selectedApplication.restaurant_name}</p>
                                <p><strong>Type:</strong> {selectedApplication.restaurant_type}</p>
                                <p><strong>Adresse:</strong> {selectedApplication.restaurant_address}</p>
                                {selectedApplication.restaurant_description && (
                                  <p><strong>Description:</strong> {selectedApplication.restaurant_description}</p>
                                )}
                              </div>
                              {selectedApplication.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                  <Button 
                                    onClick={() => handleApprove(selectedApplication)}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleReject(selectedApplication.id)}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Rejeter
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(application)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleReject(application.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Rejeter
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune demande de restaurant trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RestaurantApplications;
