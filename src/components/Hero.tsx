
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useAmadeusSearch } from '@/hooks/useAmadeusSearch';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const { searchHotels, loading } = useAmadeusSearch();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination || !checkIn || !checkOut) {
      return;
    }

    // Map common city names to IATA codes for Amadeus
    const cityCodeMap: { [key: string]: string } = {
      'paris': 'PAR',
      'london': 'LON',
      'new york': 'NYC',
      'tokyo': 'TYO',
      'madrid': 'MAD',
      'rome': 'ROM',
      'berlin': 'BER',
      'amsterdam': 'AMS',
    };

    const cityCode = cityCodeMap[destination.toLowerCase()] || 'PAR';

    await searchHotels({
      cityCode,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: 1,
    });

    // Navigate to destinations with search results
    navigate('/destinations');
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 gradient-hero opacity-20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-travel-900/60 to-coral-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
          Discover Your Next
          <span className="block text-coral-300">Adventure</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Find unique stays and experiences around the world with Stayezy. 
          Your perfect getaway is just a click away.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where to?
              </label>
              <input
                type="text"
                placeholder="Paris, London, New York..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travel-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travel-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travel-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 gradient-travel text-white py-3 text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Search className="mr-2 h-5 w-5" />
            {loading ? 'Searching...' : 'Search Stays'}
          </Button>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm opacity-80">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-sm opacity-80">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.8★</div>
            <div className="text-sm opacity-80">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
