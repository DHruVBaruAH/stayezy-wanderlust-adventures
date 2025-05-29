
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AmadeusToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://purxymgnptnnldvbqity.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey!);

async function getAmadeusToken(): Promise<string> {
  const now = Date.now();
  
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  const apiKey = Deno.env.get('AMADEUS_API_KEY');
  const apiSecret = Deno.env.get('AMADEUS_API_SECRET');
  
  console.log('Getting Amadeus token...');

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get Amadeus token:', response.status, errorText);
    throw new Error(`Failed to get Amadeus token: ${response.status}`);
  }

  const data: AmadeusToken = await response.json();
  
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };

  console.log('Amadeus token obtained successfully');
  return data.access_token;
}

async function searchHotels(params: any) {
  const token = await getAmadeusToken();
  
  // First, search for hotels by city to get hotel IDs
  const searchParams = new URLSearchParams({
    cityCode: params.cityCode || 'PAR',
  });

  console.log('Searching hotels by city with params:', searchParams.toString());

  const hotelsResponse = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!hotelsResponse.ok) {
    const errorText = await hotelsResponse.text();
    console.error('Failed to search hotels by city:', hotelsResponse.status, errorText);
    throw new Error(`Failed to search hotels by city: ${hotelsResponse.status}`);
  }

  const hotelsData = await hotelsResponse.json();
  console.log('Found hotels:', hotelsData.data?.length || 0);

  if (!hotelsData.data || hotelsData.data.length === 0) {
    return { data: [] };
  }

  // Get hotel IDs (limit to first 20 for API limits)
  const hotelIds = hotelsData.data.slice(0, 20).map((hotel: any) => hotel.hotelId);
  
  // Now search for offers using hotel IDs
  const offersParams = new URLSearchParams({
    hotelIds: hotelIds.join(','),
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.adults?.toString() || '1',
    ...(params.roomQuantity && { roomQuantity: params.roomQuantity.toString() }),
  });

  console.log('Searching hotel offers with params:', offersParams.toString());

  const offersResponse = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?${offersParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!offersResponse.ok) {
    const errorText = await offersResponse.text();
    console.error('Failed to get hotel offers:', offersResponse.status, errorText);
    throw new Error(`Failed to get hotel offers: ${offersResponse.status}`);
  }

  const offersData = await offersResponse.json();
  console.log('Found offers:', offersData.data?.length || 0);

  return offersData;
}

async function getHotelOffers(hotelIds: string[], params: any) {
  const token = await getAmadeusToken();
  
  const searchParams = new URLSearchParams({
    hotelIds: hotelIds.join(','),
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.adults?.toString() || '1',
  });

  const response = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get hotel offers:', response.status, errorText);
    throw new Error(`Failed to get hotel offers: ${response.status}`);
  }

  return await response.json();
}

async function bookHotel(offerId: string, guestInfo: any, userId: string) {
  console.log('Simulating hotel booking...');
  
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        destination_id: offerId,
        guests: 1,
        total_price: 100,
        check_in_date: new Date().toISOString().split('T')[0],
        check_out_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'confirmed',
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Booking simulated but failed to record in DB',
        offerId,
        guestInfo,
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Booking simulated successfully (Amadeus test env)',
      offerId,
      guestInfo,
      bookingId: data?.[0]?.id,
    };
  } catch (dbError) {
    console.error('Database operation failed:', dbError);
    return {
      success: false,
      message: 'Booking simulated but database operation failed',
      offerId,
      guestInfo,
      error: dbError.message,
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    console.log('Edge function called with action:', action);

    let result;
    switch (action) {
      case 'searchHotels':
        result = await searchHotels(params);
        break;
      case 'getHotelOffers':
        result = await getHotelOffers(params.hotelIds, params);
        break;
      case 'bookHotel':
        result = await bookHotel(params.offerId, params.guestInfo, params.userId);
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in amadeus-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
