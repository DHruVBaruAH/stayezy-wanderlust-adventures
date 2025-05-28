import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { amadeusService } from '@/services/amadeusService';

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
  amadeus_data?: { id: string };
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);

  const handleViewDetails = () => {
    navigate(`/destination/${destination.id}`);
  };

  const handleBookNow = async (guestName: string, guestEmail: string) => {
    setBookingLoading(true);
    setBookingResult(null);
    try {
      const offerId = destination.amadeus_data?.id || destination.id;
      const guestInfo = { name: guestName, email: guestEmail };
      const result = await amadeusService.bookHotel(offerId, guestInfo);
      setBookingResult(result.success ? 'Booking successful!' : 'Booking failed.');
    } catch (e) {
      setBookingResult('Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
      <div className="relative">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-gray-900">
            ⭐ {destination.rating}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 bg-travel-600 text-white px-3 py-1 rounded-full">
          <span className="text-sm font-semibold">${destination.price_per_night}/night</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-sm text-travel-600 font-medium">{destination.location}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {destination.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {destination.description}
        </p>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {destination.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {destination.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{destination.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <Button onClick={handleViewDetails} variant="outline" className="w-full">View Details</Button>
          {destination.amadeus_data && (
            <Button onClick={() => setShowBooking(true)} className="w-full" variant="accent">Book Now</Button>
          )}
          {showBooking && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs flex flex-col gap-4">
                <h2 className="text-lg font-bold">Book Hotel</h2>
                <input type="text" placeholder="Your Name" className="border p-2 rounded" id="guestName" />
                <input type="email" placeholder="Your Email" className="border p-2 rounded" id="guestEmail" />
                <Button
                  onClick={() => {
                    const guestName = (document.getElementById('guestName') as HTMLInputElement)?.value;
                    const guestEmail = (document.getElementById('guestEmail') as HTMLInputElement)?.value;
                    handleBookNow(guestName, guestEmail);
                  }}
                  disabled={bookingLoading}
                  className="w-full"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </Button>
                {bookingResult && <div className="text-center text-green-600">{bookingResult}</div>}
                <Button variant="ghost" onClick={() => setShowBooking(false)} className="w-full">Close</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
