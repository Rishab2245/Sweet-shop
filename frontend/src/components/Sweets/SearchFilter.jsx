import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

const SearchFilter = ({ onSearch, onClear }) => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    
    if (searchParams.name.trim()) params.name = searchParams.name.trim();
    if (searchParams.category.trim()) params.category = searchParams.category.trim();
    if (searchParams.minPrice) params.minPrice = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) params.maxPrice = parseFloat(searchParams.maxPrice);

    onSearch(params);
  };

  const handleClear = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
    setShowFilters(false);
    onClear();
  };

  const hasActiveFilters = Object.values(searchParams).some(value => value !== '');

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main search bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                name="name"
                type="text"
                placeholder="Search sweets by name..."
                value={searchParams.name}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button type="submit">
              Search
            </Button>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g., Cakes, Candies"
                  value={searchParams.category}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minPrice">Min Price ($)</Label>
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={searchParams.minPrice}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price ($)</Label>
                <Input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  value={searchParams.maxPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;

