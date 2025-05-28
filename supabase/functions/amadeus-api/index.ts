import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Add Deno type declaration for TypeScript

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

const supabaseUrl = Deno.env.get('https://purxymgnptnnldvbqity.supabase.co');
const supabaseKey = Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cnh5bWducHRubmxkdmJxaXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE4MTM0NywiZXhwIjoyMDYzNzU3MzQ3fQ.5Wshtm6xFhH10W1Qbn2sE1YtYgIGl3XFWVezN9bxxlY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAmadeusToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  const apiKey = Deno.env.get('ZASAVdrW5SZmPiPzYdjRfZUyL5A66KEe');
  const apiSecret = Deno.env.get('zoGNUNsj9FC1opAL');
  console.log('Amadeus API Key:', apiKey, 'API Secret:', apiSecret);

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
    throw new Error('Failed to get Amadeus token');
  }

  const data: AmadeusToken = await response.json();
  
  // Cache token with 5 minutes buffer before expiry
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

async function searchHotels(params: any) {
  const token = await getAmadeusToken();
  
  const searchParams = new URLSearchParams({
    cityCode: params.cityCode || 'PAR',
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: params.adults?.toString() || '1',
    ...(params.roomQuantity && { roomQuantity: params.roomQuantity.toString() }),
  });

  const response = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search hotels');
  }

  return await response.json();
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
    throw new Error('Failed to get hotel offers');
  }

  return await response.json();
}

async function bookHotel(offerId, guestInfo, userId) {
  // Simulate booking (Amadeus test env does not support real bookings)
  // Insert booking record into Supabase
  const { data, error } = await (supabase as any)
    .from("amadeus_bookings")
    .insert({
      user_id: userId,
      offer_id: offerId,
      guest_name: guestInfo.name,
      guest_email: guestInfo.email,
      status: 'confirmed',
    })
    .select();
  if (error) {
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
    message: 'Booking simulated (Amadeus test env)',
    offerId,
    guestInfo,
    bookingId: data?.[0]?.id,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

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
        throw new Error('Invalid action');
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
