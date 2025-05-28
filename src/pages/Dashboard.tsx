import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, CreditCard, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email: string;
}

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user?.id)
        .single();

      if (profileData && !profileError) {
        setProfile(profileData);
      }

      // Fetch booking stats from existing bookings table
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('status, check_in_date')
        .eq('user_id', user?.id);

      if (bookingsData && !bookingsError) {
        const now = new Date();
        const upcoming = bookingsData.filter(
          booking => booking.status === 'confirmed' && new Date(booking.check_in_date) > now
        ).length;
        const completed = bookingsData.filter(
          booking => booking.status === 'completed'
        ).length;

        setStats({
          totalBookings: bookingsData.length,
          upcomingBookings: upcoming,
          completedBookings: completed
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return `${profile.first_name} ${profile.last_name || ''}`.trim();
    }
    return profile?.email?.split('@')[0] || 'there';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {getDisplayName()}!
          </h1>
          <p className="text-gray-600">Manage your bookings and explore new destinations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/bookings')} 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
          >
            <CreditCard className="h-6 w-6" />
            <span>My Bookings</span>
          </Button>

          <Button 
            onClick={() => navigate('/destinations')} 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
          >
            <MapPin className="h-6 w-6" />
            <span>Explore</span>
          </Button>

          <Button 
            onClick={() => navigate('/experiences')} 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
          >
            <Star className="h-6 w-6" />
            <span>Experiences</span>
          </Button>

          <Button 
            onClick={() => navigate('/profile')} 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
          >
            <User className="h-6 w-6" />
            <span>Profile</span>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to show.</p>
              <Button 
                onClick={() => navigate('/destinations')} 
                className="mt-4"
                variant="accent"
              >
                Start Exploring
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
