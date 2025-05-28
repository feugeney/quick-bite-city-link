
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

// Ces fonctions sont maintenant dépréciées et seront remplacées par le hook useOrderStatuses
// Elles sont conservées temporairement pour la compatibilité

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
  }).format(price);
};

// Fonctions de compatibilité - utiliser useOrderStatuses à la place
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-orange-100 text-orange-800',
    'ready': 'bg-green-100 text-green-800',
    'out_for_delivery': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-200 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'pending': 'En attente',
    'preparing': 'En préparation',
    'ready': 'Prête',
    'out_for_delivery': 'En livraison',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  };
  return texts[status] || status;
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  const validStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
  return validStatuses.includes(status as OrderStatus);
};

export const getAllValidStatuses = (): OrderStatus[] => {
  return ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
};

// Fonctions dépréciées - utiliser useOrderStatuses à la place
export const getNextStatus = (currentStatus: string): OrderStatus | null => {
  console.warn('getNextStatus is deprecated. Use useOrderStatuses hook instead.');
  switch (currentStatus) {
    case 'pending': return 'preparing';
    case 'preparing': return 'ready';
    case 'ready': return 'out_for_delivery';
    case 'out_for_delivery': return 'delivered';
    default: return null;
  }
};

export const getNextStatusText = (currentStatus: string) => {
  console.warn('getNextStatusText is deprecated. Use useOrderStatuses hook instead.');
  switch (currentStatus) {
    case 'pending': return 'Accepter la commande';
    case 'preparing': return 'Marquer comme prête';
    case 'ready': return 'Envoyer en livraison';
    case 'out_for_delivery': return 'Marquer comme livrée';
    default: return null;
  }
};
