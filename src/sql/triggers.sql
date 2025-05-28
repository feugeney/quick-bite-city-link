
-- Ce fichier est uniquement à titre informatif pour documenter les triggers SQL qui ont été appliqués
-- Ne pas exécuter directement, les triggers sont déjà appliqués au niveau de la base de données

-- Trigger pour notifier le propriétaire du restaurant lorsqu'une nouvelle commande est passée
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  restaurant_owner_id UUID;
  client_name TEXT;
BEGIN
  -- Get restaurant owner ID
  SELECT owner_id INTO restaurant_owner_id FROM restaurants WHERE id = NEW.restaurant_id;
  
  -- Get client name
  SELECT first_name || ' ' || last_name INTO client_name FROM profiles WHERE id = NEW.user_id;
  
  -- Create notification for restaurant owner
  INSERT INTO notifications (user_id, title, message, related_entity_id, related_entity_type)
  VALUES (
    restaurant_owner_id, 
    'Nouvelle commande', 
    'Nouvelle commande de ' || client_name || ' pour un total de ' || NEW.total_price || ' GNF',
    NEW.id,
    'order'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger qui s'active lors de l'insertion d'une nouvelle commande
CREATE TRIGGER trigger_handle_new_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_order();
