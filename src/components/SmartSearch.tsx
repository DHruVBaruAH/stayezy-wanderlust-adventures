
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { searchCities, findCityByQuery, CityData } from '@/utils/cityDatabase';
import { cn } from '@/lib/utils';

interface SmartSearchProps {
  onSearch: (cityCode: string, cityName: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  placeholder = "Search destinations...",
  className,
  loading = false
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const results = searchCities(query, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCity(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCity = (city: CityData) => {
    setQuery(city.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(city.iataCode, city.name);
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    const city = findCityByQuery(query);
    if (city) {
      onSearch(city.iataCode, city.name);
    } else {
      // Fallback to Paris if no match found
      onSearch("PAR", query);
    }
    setShowSuggestions(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => query.length >= 2 && setSuggestions(searchCities(query, 5))}
          className="pl-10 pr-20"
          disabled={loading}
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
          size="sm"
        >
          {loading ? "..." : "Search"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <button
              key={`${city.iataCode}-${index}`}
              type="button"
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3",
                selectedIndex === index && "bg-blue-50"
              )}
              onClick={() => selectCity(city)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {city.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {city.country} • {city.iataCode}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
