import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SweetForm from '../components/Sweets/SweetForm';
import { sweetsService } from '../services/sweets';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Plus, Edit, Trash2, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  
  const { user, isAdmin } = useAuth();

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsService.getAllSweets();
      setSweets(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sweet) => {
    if (!window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
      return;
    }

    try {
      await sweetsService.deleteSweet(sweet.id);
      toast.success(`${sweet.name} deleted successfully`);
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingSweet(null);
    fetchSweets();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSweet(null);
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    fetchSweets();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showAddForm || editingSweet) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SweetForm
            sweet={editingSweet}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const lowStockSweets = sweets.filter(sweet => sweet.quantity <= 5);
  const outOfStockSweets = sweets.filter(sweet => sweet.quantity === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 text-purple-500 mr-3" />
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your sweet shop inventory and settings
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sweet</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sweets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSweets}</div>
              <p className="text-xs text-muted-foreground">
                Different sweet varieties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total stock value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockSweets.length}</div>
              <p className="text-xs text-muted-foreground">
                Items with ≤5 quantity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockSweets.length}</div>
              <p className="text-xs text-muted-foreground">
                Items needing restock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Manage all sweets in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : sweets.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sweets in inventory</h3>
                <p className="text-gray-500 mb-4">Add your first sweet to get started!</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sweet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sweets.map((sweet) => (
                  <div
                    key={sweet.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{sweet.name}</h3>
                        <Badge variant="secondary">{sweet.category}</Badge>
                        {sweet.quantity === 0 && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {sweet.quantity > 0 && sweet.quantity <= 5 && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Price: ${sweet.price.toFixed(2)}</span>
                        <span>Quantity: {sweet.quantity}</span>
                        <span>Value: ${(sweet.price * sweet.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSweet(sweet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(sweet)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

