import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AmadeusBooking {
  id: string;
  offer_id: string;
  guest_name: string;
  guest_email: string;
  status: string;
  created_at: string;
}

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<AmadeusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchBookings();
    fetchUserName();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("amadeus_bookings")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async () => {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    if (data && data.name) setUserName(data.name);
  };

  const handleCancel = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      const { error } = await supabase
        .from("amadeus_bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert("Failed to cancel booking.");
    } finally {
      setCancelling(null);
    }
  };

  // Group bookings
  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.created_at) > now
  );
  const current = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.created_at) <= now
  );
  const past = bookings.filter((b) => b.status !== "confirmed");

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          My Bookings
        </h1>
        {userName && (
          <div className='text-lg text-gray-700 mb-6'>
            Welcome, {userName}!
          </div>
        )}

        {/* Upcoming Bookings */}
        {upcoming.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Upcoming</h2>
            {upcoming.map((booking) => (
              <Card key={booking.id} className='mb-4'>
                <CardContent className='p-4'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                    <div>
                      <div className='font-bold'>Offer ID: {booking.offer_id}</div>
                      <div>Guest: {booking.guest_name} ({booking.guest_email})</div>
                      <div>Status: <span className='text-green-600'>{booking.status}</span></div>
                      <div>Created: {new Date(booking.created_at).toLocaleString()}</div>
                    </div>
                    <Button
                      variant='destructive'
                      disabled={cancelling === booking.id}
                      onClick={() => handleCancel(booking.id)}
                      className='mt-4 md:mt-0'
                    >
                      {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Current Bookings */}
        {current.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Current</h2>
            {current.map((booking) => (
              <Card key={booking.id} className='mb-4'>
                <CardContent className='p-4'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                    <div>
                      <div className='font-bold'>Offer ID: {booking.offer_id}</div>
                      <div>Guest: {booking.guest_name} ({booking.guest_email})</div>
                      <div>Status: <span className='text-green-600'>{booking.status}</span></div>
                      <div>Created: {new Date(booking.created_at).toLocaleString()}</div>
                    </div>
                    <Button
                      variant='destructive'
                      disabled={cancelling === booking.id}
                      onClick={() => handleCancel(booking.id)}
                      className='mt-4 md:mt-0'
                    >
                      {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past Bookings */}
        {past.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Past/Cancelled</h2>
            {past.map((booking) => (
              <Card key={booking.id} className='mb-4'>
                <CardContent className='p-4'>
                  <div>
                    <div className='font-bold'>Offer ID: {booking.offer_id}</div>
                    <div>Guest: {booking.guest_name} ({booking.guest_email})</div>
                    <div>Status: <span className='text-gray-500'>{booking.status}</span></div>
                    <div>Created: {new Date(booking.created_at).toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {bookings.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg mb-4'>You haven't made any bookings yet.</p>
            <Button onClick={() => navigate("/destinations")} className='gradient-travel text-white'>Explore Destinations</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
