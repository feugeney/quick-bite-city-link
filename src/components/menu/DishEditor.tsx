
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string | null;
  menu_id: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  menu_category_id: string | null;
}

interface DishEditorProps {
  dish?: Dish;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onDishCreated: (dish: Dish) => void;
}

const DishEditor = ({ dish, open, onOpenChange, categories, onDishCreated }: DishEditorProps) => {
  const [name, setName] = useState(dish?.name || '');
  const [description, setDescription] = useState(dish?.description || '');
  const [price, setPrice] = useState(dish?.price ? (dish.price / 100).toString() : '');
  const [categoryId, setCategoryId] = useState<string>(dish?.menu_category_id || categories[0]?.id || '');
  const [isAvailable, setIsAvailable] = useState(dish?.is_available ?? true);
  const [imageUrl, setImageUrl] = useState(dish?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens/closes or dish changes
  useState(() => {
    if (open) {
      setName(dish?.name || '');
      setDescription(dish?.description || '');
      setPrice(dish?.price ? (dish.price / 100).toString() : '');
      setCategoryId(dish?.menu_category_id || categories[0]?.id || '');
      setIsAvailable(dish?.is_available ?? true);
      setImageUrl(dish?.image_url || '');
      setImageFile(null);
    }
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price || !categoryId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être un nombre valide supérieur à 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const priceInCents = Math.round(priceValue * 100);
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        try {
          const { data: category } = await supabase
            .from('menu_categories')
            .select('menu_id')
            .eq('id', categoryId)
            .single();
            
          if (category) {
            const { data: menu } = await supabase
              .from('menus')
              .select('restaurant_id')
              .eq('id', category.menu_id)
              .single();
              
            if (menu) {
              const restaurantId = menu.restaurant_id;
              
              const fileExt = imageFile.name.split('.').pop();
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
              const filePath = `dishes/${restaurantId}/${fileName}`;
              
              const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('food-images')
                .upload(filePath, imageFile);
                
              if (uploadError) {
                console.warn('Upload error:', uploadError);
                // Continue without image if upload fails
              } else {
                const { data: { publicUrl } } = supabase
                  .storage
                  .from('food-images')
                  .getPublicUrl(filePath);
                  
                finalImageUrl = publicUrl;
              }
            }
          }
        } catch (uploadError) {
          console.warn('Image upload failed, continuing without image:', uploadError);
        }
      }
      
      let newDish: Dish;
      
      if (dish) {
        const { data: updatedDish, error } = await supabase
          .from('dishes')
          .update({
            name: name.trim(),
            description: description.trim(),
            price: priceInCents,
            image_url: finalImageUrl || null,
            is_available: isAvailable,
            menu_category_id: categoryId
          })
          .eq('id', dish.id)
          .select()
          .single();
          
        if (error) throw error;
        newDish = updatedDish;
      } else {
        const { data: category } = await supabase
          .from('menu_categories')
          .select('menu_id')
          .eq('id', categoryId)
          .single();
          
        if (!category) throw new Error("Catégorie non trouvée");
        
        const { data: menu } = await supabase
          .from('menus')
          .select('restaurant_id')
          .eq('id', category.menu_id)
          .single();
          
        if (!menu) throw new Error("Menu non trouvé");
        
        const { data: createdDish, error } = await supabase
          .from('dishes')
          .insert({
            name: name.trim(),
            description: description.trim(),
            price: priceInCents,
            image_url: finalImageUrl || null,
            is_available: isAvailable,
            menu_category_id: categoryId,
            restaurant_id: menu.restaurant_id
          })
          .select()
          .single();
          
        if (error) throw error;
        newDish = createdDish;
      }
      
      onDishCreated(newDish);
      onOpenChange(false);
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId(categories[0]?.id || '');
      setIsAvailable(true);
      setImageUrl('');
      setImageFile(null);
      
      toast({
        title: "Succès",
        description: dish ? "Plat mis à jour avec succès" : "Nouveau plat créé avec succès",
      });
      
    } catch (error) {
      console.error('Error saving dish:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder le plat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dish ? 'Modifier le plat' : 'Ajouter un nouveau plat'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du plat *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Poulet Yassa"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du plat"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Prix (GNF) *</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 50000"
              min="0"
              step="1000"
              required
            />
          </div>
          
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="image">Image du plat</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imageUrl && (
              <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              id="is-available"
            />
            <Label htmlFor="is-available">Disponible à la vente</Label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !price || !categoryId}
              className="flex-1"
            >
              {loading ? 'Enregistrement...' : dish ? 'Mettre à jour' : 'Créer le plat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishEditor;
