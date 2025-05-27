
import { supabase } from '@/integrations/supabase/client';

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
}

export interface AmadeusHotel {
  hotelId: string;
  name: string;
  cityCode: string;
  latitude?: number;
  longitude?: number;
  address?: {
    lines: string[];
    cityName: string;
    countryCode: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  description?: {
    text: string;
  };
  amenities?: string[];
}

export interface AmadeusOffer {
  id: string;
  hotel: AmadeusHotel;
  available: boolean;
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
      };
    };
    guests: {
      adults: number;
    };
    price: {
      currency: string;
      base: string;
      total: string;
      taxes: Array<{
        code: string;
        amount: string;
        currency: string;
        included: boolean;
      }>;
    };
    policies: {
      cancellations: Array<{
        type: string;
        amount: string;
        deadline: string;
      }>;
      paymentType: string;
      guarantee: {
        acceptedPayments: {
          creditCards: string[];
          methods: string[];
        };
      };
    };
  }>;
}

export const amadeusService = {
  async searchHotels(params: HotelSearchParams): Promise<{ data: AmadeusOffer[] }> {
    try {
      const { data, error } = await supabase.functions.invoke('amadeus-api', {
        body: {
          action: 'searchHotels',
          ...params,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  async getHotelOffers(hotelIds: string[], params: Omit<HotelSearchParams, 'cityCode'>): Promise<{ data: AmadeusOffer[] }> {
    try {
      const { data, error } = await supabase.functions.invoke('amadeus-api', {
        body: {
          action: 'getHotelOffers',
          hotelIds,
          ...params,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting hotel offers:', error);
      throw error;
    }
  },

  // Convert Amadeus hotel data to our app format
  convertToDestination(offer: AmadeusOffer): any {
    const hotel = offer.hotel;
    const firstOffer = offer.offers[0];
    
    return {
      id: hotel.hotelId,
      name: hotel.name,
      location: hotel.address ? `${hotel.address.cityName}, ${hotel.address.countryCode}` : hotel.cityCode,
      description: hotel.description?.text || 'Beautiful accommodation with excellent amenities.',
      price_per_night: firstOffer ? parseFloat(firstOffer.price.base) : 0,
      rating: Math.random() * 2 + 3, // Random rating between 3-5 (Amadeus doesn't provide ratings in test env)
      image_url: `https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      amenities: hotel.amenities || ['WiFi', 'Air Conditioning', 'Room Service'],
      max_guests: firstOffer?.guests.adults || 2,
      amadeus_data: offer, // Store original data for booking
    };
  },
};
