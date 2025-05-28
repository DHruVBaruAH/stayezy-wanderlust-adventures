import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DestinationCard from '@/components/DestinationCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useAmadeusSearch } from '@/hooks/useAmadeusSearch';
import { useLocation } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  price_per_night: number;
  rating: number;
  image_url: string;
  amenities: string[];
  max_guests: number;
  amadeus_data?: any;
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { hotels: amadeusHotels, loading: amadeusLoading, searchHotels } = useAmadeusSearch();
  const location = useLocation();

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Sync searchTerm with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchTerm(search);
  }, [location.search]);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine mock destinations and Amadeus results
  const allDestinations = [...destinations, ...amadeusHotels];

  const filteredDestinations = allDestinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = !priceFilter || 
      (priceFilter === 'low' && destination.price_per_night < 150) ||
      (priceFilter === 'medium' && destination.price_per_night >= 150 && destination.price_per_night < 250) ||
      (priceFilter === 'high' && destination.price_per_night >= 250);

    return matchesSearch && matchesPrice;
  });

  const handleQuickSearch = async (cityCode: string, cityName: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    await searchHotels({
      cityCode,
      checkInDate: tomorrow.toISOString().split('T')[0],
      checkOutDate: dayAfter.toISOString().split('T')[0],
      adults: 1,
    });
  };

  if (loading && !amadeusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading destinations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Destinations</h1>
          
          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-600 mr-2">Quick search:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('PAR', 'Paris')}
              disabled={amadeusLoading}
            >
              Paris
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('LON', 'London')}
              disabled={amadeusLoading}
            >
              London
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('NYC', 'New York')}
              disabled={amadeusLoading}
            >
              New York
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('TYO', 'Tokyo')}
              disabled={amadeusLoading}
            >
              Tokyo
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={priceFilter === '' ? 'default' : 'outline'}
                onClick={() => setPriceFilter('')}
                size="sm"
              >
                All Prices
              </Button>
              <Button
                variant={priceFilter === 'low' ? 'default' : 'outline'}
                onClick={() => setPriceFilter('low')}
                size="sm"
              >
                Under $150
              </Button>
              <Button
                variant={priceFilter === 'medium' ? 'default' : 'outline'}
                onClick={() => setPriceFilter('medium')}
                size="sm"
              >
                $150-$250
              </Button>
              <Button
                variant={priceFilter === 'high' ? 'default' : 'outline'}
                onClick={() => setPriceFilter('high')}
                size="sm"
              >
                $250+
              </Button>
            </div>
          </div>

          {amadeusLoading && (
            <div className="text-center py-4">
              <div className="text-travel-600">Searching for real hotels...</div>
            </div>
          )}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {filteredDestinations.length === 0 && !amadeusLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
