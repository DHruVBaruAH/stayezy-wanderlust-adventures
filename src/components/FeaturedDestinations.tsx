
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$180",
    rating: 4.9,
    description: "Stunning sunsets and white-washed buildings overlooking the Aegean Sea",
    location: "Greek Islands"
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$95",
    rating: 4.8,
    description: "Tropical paradise with lush rice terraces and vibrant culture",
    location: "Southeast Asia"
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$220",
    rating: 4.7,
    description: "Modern metropolis blending tradition with cutting-edge technology",
    location: "East Asia"
  },
  {
    id: 4,
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$160",
    rating: 4.9,
    description: "Ancient Incan citadel high in the Andes Mountains",
    location: "South America"
  },
  {
    id: 5,
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$350",
    rating: 5.0,
    description: "Pristine islands with crystal-clear waters and overwater bungalows",
    location: "Indian Ocean"
  },
  {
    id: 6,
    name: "Iceland",
    image: "https://images.unsplash.com/photo-1539066636618-2336fa5db323?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "$280",
    rating: 4.8,
    description: "Land of fire and ice with breathtaking natural wonders",
    location: "Northern Europe"
  }
];

const FeaturedDestinations = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the world's most incredible places, handpicked by our travel experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Card 
              key={destination.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-900">
                    ⭐ {destination.rating}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-travel-600 text-white px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">From {destination.price}/night</span>
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
                <Button className="w-full gradient-travel text-white hover:opacity-90 transition-opacity">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-travel-500 text-travel-600 hover:bg-travel-50">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
