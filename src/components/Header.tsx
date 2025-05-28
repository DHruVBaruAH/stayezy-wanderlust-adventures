
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          // Create display name from available data
          const displayName = data.first_name 
            ? `${data.first_name} ${data.last_name || ''}`.trim()
            : data.email?.split('@')[0] || 'User';
          setUserName(displayName);
        }
      } else {
        setUserName(null);
      }
    };
    fetchUserName();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className='bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
            <Logo size='md' />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className='hidden md:flex items-center flex-1 max-w-md mx-8'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-4 w-4' />
              <Input
                type='text'
                placeholder='Search destinations...'
                className='pl-10 pr-4 py-2 w-full rounded-full border-input focus:border-primary focus:ring-primary'
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <button
              onClick={() => navigate('/destinations')}
              className='text-secondary hover:text-primary transition-colors bg-transparent border-none outline-none cursor-pointer'>
              Destinations
            </button>
            <button
              onClick={() => navigate('/experiences')}
              className='text-secondary hover:text-primary transition-colors bg-transparent border-none outline-none cursor-pointer'>
              Experiences
            </button>
            <button
              onClick={() => navigate('/about')}
              className='text-secondary hover:text-primary transition-colors bg-transparent border-none outline-none cursor-pointer'>
              About
            </button>
          </nav>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {user && userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/bookings')}>
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant='ghost'
                  className='hidden md:inline-flex'
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button
                  variant='accent'
                  className='hover:opacity-90 transition-opacity'
                  onClick={() => navigate('/auth/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <User className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className='md:hidden pb-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-4 w-4' />
            <Input
              type='text'
              placeholder='Search destinations...'
              className='pl-10 pr-4 py-2 w-full rounded-full border-input focus:border-primary focus:ring-primary'
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
