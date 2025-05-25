
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/destination/${destination.id}`);
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
        <Button 
          onClick={handleViewDetails}
          className="w-full gradient-travel text-white hover:opacity-90 transition-opacity"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
