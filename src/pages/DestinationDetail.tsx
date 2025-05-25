
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, Star, Wifi, MapPin } from 'lucide-react';

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
}

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const fetchDestination = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDestination(data);
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast({
        title: "Error",
        description: "Failed to load destination details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Information",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * (destination?.price_per_night || 0);

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          destination_id: id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          guests,
          total_price: totalPrice,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Successful!",
        description: `Your booking for ${destination?.name} has been confirmed.`,
      });

      navigate('/bookings');
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading destination...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Destination not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-travel-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{destination.location}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{destination.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{destination.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Up to {destination.max_guests} guests</span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{destination.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {destination.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                    <Wifi className="h-4 w-4 text-travel-600" />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900">
                    ${destination.price_per_night}
                    <span className="text-base font-normal text-gray-600">/night</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="check-in">Check-in</Label>
                    <Input
                      id="check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="check-out">Check-out</Label>
                    <Input
                      id="check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={destination.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                    />
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full gradient-travel text-white"
                  >
                    {booking ? 'Booking...' : 'Book Now'}
                  </Button>

                  {!user && (
                    <p className="text-sm text-gray-600 text-center">
                      Please <button onClick={() => navigate('/auth')} className="text-travel-600 underline">sign in</button> to make a booking
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
