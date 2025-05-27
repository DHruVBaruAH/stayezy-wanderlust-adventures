
import { useState, useCallback } from 'react';
import { amadeusService, HotelSearchParams } from '@/services/amadeusService';
import { useToast } from '@/hooks/use-toast';

export const useAmadeusSearch = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchHotels = useCallback(async (params: HotelSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await amadeusService.searchHotels(params);
      const convertedHotels = response.data.map(offer => 
        amadeusService.convertToDestination(offer)
      );
      
      setHotels(convertedHotels);
      
      if (convertedHotels.length === 0) {
        toast({
          title: "No hotels found",
          description: "Try adjusting your search criteria.",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search hotels';
      setError(errorMessage);
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    hotels,
    loading,
    error,
    searchHotels,
  };
};
