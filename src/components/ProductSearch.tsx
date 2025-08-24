import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  vendors: { store_name: string };
}

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductSearchProps {
  onResults: (products: Product[]) => void;
  onSearchChange: (query: string) => void;
}

export function ProductSearch({ onResults, onSearchChange }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    priceRange: [0, 1000000],
    inStockOnly: false,
    sortBy: 'name',
  });
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-suggest functionality
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, stock, vendors(store_name)')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, name, description, price, image_url, stock, vendors(store_name)');

      // Apply text search
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters.inStockOnly) {
        query = query.gt('stock', 0);
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      // Apply sorting
      const sortColumn = filters.sortBy === 'price_low' ? 'price' : 
                        filters.sortBy === 'price_high' ? 'price' :
                        filters.sortBy === 'newest' ? 'created_at' : 'name';
      
      const sortOrder = filters.sortBy === 'price_high' ? false : true;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error } = await query;

      if (error) throw error;
      onResults(data || []);
      onSearchChange(searchQuery);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    // Trigger search with selected product
    setTimeout(performSearch, 100);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000000],
      inStockOnly: false,
      sortBy: 'name',
    });
  };

  const hasActiveFilters = filters.category || 
                          filters.priceRange[0] > 0 || 
                          filters.priceRange[1] < 1000000 ||
                          filters.inStockOnly ||
                          filters.sortBy !== 'name';

  return (
    <div className="space-y-4">
      {/* Search Input with Suggestions */}
      <div ref={searchRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              className="pl-10"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <SlidersHorizontal className="h-4 w-4" />
                {hasActiveFilters && (
                  <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <Select value={filters.sortBy} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, sortBy: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))
                    }
                    max={1000000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₦{filters.priceRange[0].toLocaleString()}</span>
                    <span>₦{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStockOnly}
                    onChange={(e) => 
                      setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium">
                    In stock only
                  </label>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={performSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
            <CardContent className="p-0">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{product.price.toLocaleString()} • {product.vendors.store_name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.sortBy !== 'name' && (
            <Badge variant="secondary">
              Sort: {filters.sortBy.replace('_', ' ')}
              <X className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, sortBy: 'name' }))} 
              />
            </Badge>
          )}
          {filters.inStockOnly && (
            <Badge variant="secondary">
              In Stock Only
              <X className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))} 
              />
            </Badge>
          )}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) && (
            <Badge variant="secondary">
              ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
              <X className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000000] }))} 
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}