import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedDestinations from '@/components/FeaturedDestinations';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data } = await (supabase as any)
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (data && data.name) setUserName(data.name);
      }
    };
    fetchUserName();
  }, [user]);

  return (
    <div className="min-h-screen w-full">
      <Header />
      {userName && (
        <div className="text-lg text-gray-700 text-center mt-4">Welcome, {userName}!</div>
      )}
      <Hero />
      <FeaturedDestinations />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
