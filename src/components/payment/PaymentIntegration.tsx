
import { useState } from 'react';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  available: boolean;
}

interface PaymentIntegrationProps {
  total: number;
  onPaymentSuccess: (paymentReference: string) => void;
  onPaymentCancel: () => void;
}

const PaymentIntegration = ({ total, onPaymentSuccess, onPaymentCancel }: PaymentIntegrationProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces lors de la réception',
      icon: DollarSign,
      available: true
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      description: 'Paiement mobile Orange Money',
      icon: Smartphone,
      available: true
    },
    {
      id: 'moov_money',
      name: 'Moov Money',
      description: 'Paiement mobile Moov Money',
      icon: Smartphone,
      available: true
    },
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard (bientôt disponible)',
      icon: CreditCard,
      available: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      if (selectedMethod === 'cash') {
        // For cash payment, we just confirm the order
        setTimeout(() => {
          onPaymentSuccess(`CASH_${Date.now()}`);
          toast({
            title: "Commande confirmée",
            description: "Votre commande a été confirmée. Vous paierez à la livraison.",
          });
          setProcessing(false);
        }, 1000);
      } else if (selectedMethod === 'orange_money' || selectedMethod === 'moov_money') {
        if (!phoneNumber) {
          toast({
            title: "Numéro requis",
            description: "Veuillez saisir votre numéro de téléphone",
            variant: "destructive",
          });
          setProcessing(false);
          return;
        }

        // Simulate mobile money payment
        // In a real implementation, this would integrate with Orange Money/Moov Money APIs
        setTimeout(() => {
          const success = Math.random() > 0.2; // 80% success rate for simulation
          
          if (success) {
            const paymentRef = `${selectedMethod.toUpperCase()}_${Date.now()}`;
            onPaymentSuccess(paymentRef);
            toast({
              title: "Paiement réussi",
              description: `Paiement effectué avec succès via ${selectedMethod === 'orange_money' ? 'Orange Money' : 'Moov Money'}`,
            });
          } else {
            toast({
              title: "Paiement échoué",
              description: "Le paiement a échoué. Veuillez réessayer.",
              variant: "destructive",
            });
          }
          setProcessing(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Méthode de paiement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-semibold text-center p-4 bg-gray-50 rounded-lg">
          Total à payer: {formatPrice(total)}
        </div>

        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div key={method.id} className="relative">
                <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem 
                    value={method.id} 
                    id={method.id}
                    disabled={!method.available}
                  />
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={method.id} 
                      className={`font-medium ${!method.available ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {method.name}
                    </Label>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {!method.available && (
                    <Badge variant="secondary">Bientôt</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {(selectedMethod === 'orange_money' || selectedMethod === 'moov_money') && (
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ex: 628 12 34 56"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}

        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={onPaymentCancel}
            className="flex-1"
            disabled={processing}
          >
            Annuler
          </Button>
          <Button 
            onClick={handlePayment}
            className="flex-1"
            disabled={processing || !paymentMethods.find(m => m.id === selectedMethod)?.available}
          >
            {processing ? (
              "Traitement..."
            ) : selectedMethod === 'cash' ? (
              "Confirmer la commande"
            ) : (
              "Payer maintenant"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegration;
