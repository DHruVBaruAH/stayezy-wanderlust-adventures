
export interface CityData {
  name: string;
  country: string;
  iataCode: string;
  aliases: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const cityDatabase: CityData[] = [
  {
    name: "Paris",
    country: "France",
    iataCode: "PAR",
    aliases: ["paris", "city of lights", "ville lumière"],
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    name: "London",
    country: "United Kingdom",
    iataCode: "LON",
    aliases: ["london", "big ben", "uk", "england"],
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    name: "New York",
    country: "United States",
    iataCode: "NYC",
    aliases: ["new york", "nyc", "big apple", "manhattan", "brooklyn"],
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    name: "Tokyo",
    country: "Japan",
    iataCode: "TYO",
    aliases: ["tokyo", "japan", "shibuya", "harajuku"],
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    name: "Madrid",
    country: "Spain",
    iataCode: "MAD",
    aliases: ["madrid", "spain", "españa"],
    coordinates: { lat: 40.4168, lng: -3.7038 }
  },
  {
    name: "Rome",
    country: "Italy",
    iataCode: "ROM",
    aliases: ["rome", "roma", "italy", "eternal city"],
    coordinates: { lat: 41.9028, lng: 12.4964 }
  },
  {
    name: "Berlin",
    country: "Germany",
    iataCode: "BER",
    aliases: ["berlin", "germany", "deutschland"],
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    iataCode: "AMS",
    aliases: ["amsterdam", "netherlands", "holland"],
    coordinates: { lat: 52.3676, lng: 4.9041 }
  },
  {
    name: "Barcelona",
    country: "Spain",
    iataCode: "BCN",
    aliases: ["barcelona", "spain", "catalonia"],
    coordinates: { lat: 41.3851, lng: 2.1734 }
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    iataCode: "DXB",
    aliases: ["dubai", "uae", "emirates"],
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    name: "Singapore",
    country: "Singapore",
    iataCode: "SIN",
    aliases: ["singapore", "sg"],
    coordinates: { lat: 1.3521, lng: 103.8198 }
  },
  {
    name: "Sydney",
    country: "Australia",
    iataCode: "SYD",
    aliases: ["sydney", "australia", "aussie"],
    coordinates: { lat: -33.8688, lng: 151.2093 }
  }
];

export const findCityByQuery = (query: string): CityData | null => {
  if (!query || query.trim().length === 0) return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Exact match on name
  let match = cityDatabase.find(city => 
    city.name.toLowerCase() === normalizedQuery
  );
  
  if (match) return match;
  
  // Exact match on IATA code
  match = cityDatabase.find(city => 
    city.iataCode.toLowerCase() === normalizedQuery
  );
  
  if (match) return match;
  
  // Exact match on aliases
  match = cityDatabase.find(city => 
    city.aliases.some(alias => alias === normalizedQuery)
  );
  
  if (match) return match;
  
  // Partial match on name (starts with)
  match = cityDatabase.find(city => 
    city.name.toLowerCase().startsWith(normalizedQuery)
  );
  
  if (match) return match;
  
  // Partial match on aliases (starts with)
  match = cityDatabase.find(city => 
    city.aliases.some(alias => alias.startsWith(normalizedQuery))
  );
  
  if (match) return match;
  
  // Fuzzy match (contains)
  match = cityDatabase.find(city => 
    city.name.toLowerCase().includes(normalizedQuery) ||
    city.aliases.some(alias => alias.includes(normalizedQuery))
  );
  
  return match;
};

export const searchCities = (query: string, limit: number = 5): CityData[] => {
  if (!query || query.trim().length === 0) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: CityData[] = [];
  
  // Exact matches first
  cityDatabase.forEach(city => {
    if (city.name.toLowerCase() === normalizedQuery || 
        city.iataCode.toLowerCase() === normalizedQuery ||
        city.aliases.some(alias => alias === normalizedQuery)) {
      results.push(city);
    }
  });
  
  // Then partial matches
  if (results.length < limit) {
    cityDatabase.forEach(city => {
      if (!results.includes(city)) {
        if (city.name.toLowerCase().startsWith(normalizedQuery) ||
            city.aliases.some(alias => alias.startsWith(normalizedQuery))) {
          results.push(city);
        }
      }
    });
  }
  
  // Finally fuzzy matches
  if (results.length < limit) {
    cityDatabase.forEach(city => {
      if (!results.includes(city)) {
        if (city.name.toLowerCase().includes(normalizedQuery) ||
            city.aliases.some(alias => alias.includes(normalizedQuery))) {
          results.push(city);
        }
      }
    });
  }
  
  return results.slice(0, limit);
};
