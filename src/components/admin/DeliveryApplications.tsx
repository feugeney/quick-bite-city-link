
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, User, Phone, MapPin, Car, FileText } from 'lucide-react';

type DeliveryApplication = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  id_number: string;
  vehicle_type: string;
  id_card_photo_url: string | null;
  profile_photo_url: string | null;
  status: string;
  created_at: string;
};

const DeliveryApplications = () => {
  const [applications, setApplications] = useState<DeliveryApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<DeliveryApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('delivery_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de livreur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: DeliveryApplication) => {
    try {
      // Mettre à jour le rôle de l'utilisateur dans la table profiles
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'livreur' })
        .eq('id', application.user_id);

      if (roleError) throw roleError;

      // Créer une entrée dans la table livreurs
      const { error: livreurError } = await supabase
        .from('livreurs')
        .insert({
          id: application.user_id,
          is_active: false
        });

      if (livreurError) throw livreurError;

      // Marquer la demande comme approuvée
      const { error: statusError } = await supabase
        .from('delivery_applications')
        .update({ status: 'approved' })
        .eq('id', application.id);

      if (statusError) throw statusError;

      toast({
        title: "Demande approuvée",
        description: "Le livreur a été créé avec succès.",
      });

      fetchApplications();
    } catch (error: any) {
      console.error('Erreur lors de l\'approbation:', error);
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
        .from('delivery_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée.",
        variant: "destructive",
      });

      fetchApplications();
    } catch (error: any) {
      console.error('Erreur lors du rejet:', error);
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
        return <Badge variant="secondary">En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Chargement des demandes...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Demandes de livreur</h2>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.first_name} {application.last_name}
                  </TableCell>
                  <TableCell>{application.phone}</TableCell>
                  <TableCell>{application.vehicle_type}</TableCell>
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
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de la demande</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Informations personnelles</span>
                                  </div>
                                  <p><strong>Nom:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</p>
                                  <p><strong>Téléphone:</strong> {selectedApplication.phone}</p>
                                  <p><strong>Adresse:</strong> {selectedApplication.address}</p>
                                  <p><strong>N° ID:</strong> {selectedApplication.id_number}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span className="font-medium">Véhicule</span>
                                  </div>
                                  <p><strong>Type:</strong> {selectedApplication.vehicle_type}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">Documents</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {selectedApplication.id_card_photo_url && (
                                    <div>
                                      <p className="text-sm font-medium mb-2">Pièce d'identité:</p>
                                      <img 
                                        src={selectedApplication.id_card_photo_url} 
                                        alt="Pièce d'identité" 
                                        className="w-full h-32 object-cover rounded border"
                                      />
                                    </div>
                                  )}
                                  {selectedApplication.profile_photo_url && (
                                    <div>
                                      <p className="text-sm font-medium mb-2">Photo de profil:</p>
                                      <img 
                                        src={selectedApplication.profile_photo_url} 
                                        alt="Photo de profil" 
                                        className="w-full h-32 object-cover rounded border"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(application)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(application.id)}
                          >
                            <XCircle className="h-4 w-4" />
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
                  Aucune demande de livreur trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeliveryApplications;
