
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, User, Check } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your perfect stay with our advanced search filters and AI-powered recommendations",
    color: "text-travel-600"
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book your dream vacation in just a few clicks with our streamlined booking process",
    color: "text-coral-600"
  },
  {
    icon: User,
    title: "Trusted Reviews",
    description: "Read authentic reviews from verified travelers to make informed decisions",
    color: "text-travel-600"
  },
  {
    icon: Check,
    title: "Best Price Guarantee",
    description: "We guarantee the best prices and will match any lower rate you find elsewhere",
    color: "text-coral-600"
  }
];

const Features = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Stayezy?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make travel planning effortless with innovative features designed for modern explorers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className={`mx-auto w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
