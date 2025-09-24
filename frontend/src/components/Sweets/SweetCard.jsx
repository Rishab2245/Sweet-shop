import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { sweetsService } from '../../services/sweets';
import { ShoppingCart, Package, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SweetCard = ({ sweet, onUpdate, onDelete }) => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [showRestockInput, setShowRestockInput] = useState(false);

  const handlePurchase = async () => {
    if (purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity) {
      toast.error('Invalid quantity');
      return;
    }

    setLoading(true);
    try {
      await sweetsService.purchaseSweet(sweet.id, purchaseQuantity);
      toast.success(`Successfully purchased ${purchaseQuantity} ${sweet.name}(s)`);
      onUpdate();
      setPurchaseQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (restockQuantity <= 0) {
      toast.error('Invalid quantity');
      return;
    }

    setLoading(true);
    try {
      await sweetsService.restockSweet(sweet.id, restockQuantity);
      toast.success(`Successfully restocked ${restockQuantity} ${sweet.name}(s)`);
      onUpdate();
      setRestockQuantity(1);
      setShowRestockInput(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
      return;
    }

    setLoading(true);
    try {
      await sweetsService.deleteSweet(sweet.id);
      toast.success(`${sweet.name} deleted successfully`);
      onDelete(sweet.id);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {sweet.name}
          </CardTitle>
          {isAdmin && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate(sweet)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="w-fit">
          {sweet.category}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              ${sweet.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4 text-gray-500" />
              <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-gray-700'}`}>
                {sweet.quantity} in stock
              </span>
            </div>
          </div>

          {isOutOfStock && (
            <Badge variant="destructive" className="w-full justify-center">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="space-y-3">
        {/* Purchase Section */}
        <div className="w-full space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor={`quantity-${sweet.id}`} className="text-sm">
              Quantity:
            </Label>
            <Input
              id={`quantity-${sweet.id}`}
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
              className="w-20 h-8"
              disabled={isOutOfStock}
            />
          </div>
          <Button
            onClick={handlePurchase}
            disabled={loading || isOutOfStock || purchaseQuantity > sweet.quantity}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : 'Purchase'}
          </Button>
        </div>

        {/* Admin Restock Section */}
        {isAdmin && (
          <div className="w-full space-y-2 border-t pt-3">
            {!showRestockInput ? (
              <Button
                variant="outline"
                onClick={() => setShowRestockInput(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Restock
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`restock-${sweet.id}`} className="text-sm">
                    Add:
                  </Label>
                  <Input
                    id={`restock-${sweet.id}`}
                    type="number"
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 h-8"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleRestock}
                    disabled={loading}
                    size="sm"
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRestockInput(false)}
                    size="sm"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SweetCard;

