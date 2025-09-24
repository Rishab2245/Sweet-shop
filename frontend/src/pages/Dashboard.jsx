import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SweetCard from '../components/Sweets/SweetCard';
import SearchFilter from '../components/Sweets/SearchFilter';
import SweetForm from '../components/Sweets/SweetForm';
import { sweetsService } from '../services/sweets';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Candy } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  
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

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      const data = await sweetsService.searchSweets(searchParams);
      setSweets(data);
      setSearchActive(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchActive(false);
    fetchSweets();
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

  const handleEditSweet = (sweet) => {
    setEditingSweet(sweet);
    setShowAddForm(false);
  };

  const handleDeleteSweet = (sweetId) => {
    setSweets(sweets.filter(sweet => sweet.id !== sweetId));
  };

  useEffect(() => {
    fetchSweets();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Candy className="h-8 w-8 text-pink-500 mr-3" />
                Sweet Shop Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.username}! {searchActive ? 'Search results:' : 'Browse our delicious sweets:'}
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Sweet</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        )}

        {/* Sweets Grid */}
        {!loading && (
          <>
            {sweets.length === 0 ? (
              <div className="text-center py-12">
                <Candy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchActive ? 'No sweets found' : 'No sweets available'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchActive 
                    ? 'Try adjusting your search criteria.' 
                    : isAdmin 
                      ? 'Add some sweets to get started!' 
                      : 'Check back later for new sweets.'
                  }
                </p>
                {searchActive && (
                  <Button onClick={handleClearSearch} variant="outline">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                  <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    onUpdate={fetchSweets}
                    onDelete={handleDeleteSweet}
                    onEdit={handleEditSweet}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Results Summary */}
        {!loading && sweets.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {sweets.length} sweet{sweets.length !== 1 ? 's' : ''}
            {searchActive && (
              <Button
                onClick={handleClearSearch}
                variant="link"
                className="ml-2 text-pink-600 hover:text-pink-700"
              >
                Show all sweets
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

