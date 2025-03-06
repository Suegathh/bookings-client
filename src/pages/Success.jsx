import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "https://bookings-backend-g8dm.onrender.com";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the newly created booking from navigation state, if available
  const newBooking = location.state?.newBooking;

  useEffect(() => {
    // Debugging user state
    console.log("Current user state:", user);
    
    // If we have a new booking from the navigation state, add it to our bookings list immediately
    if (newBooking) {
      console.log("New booking from navigation:", newBooking);
      setBookings(prevBookings => {
        // Check if this booking is already in our list to avoid duplicates
        const exists = prevBookings.some(booking => booking._id === newBooking._id);
        return exists ? prevBookings : [newBooking, ...prevBookings];
      });
    }

    const fetchBookings = async () => {
      if (!user || !user._id) {
        console.error("No user ID found");
        setError("Please log in to view bookings");
        setLoading(false);
        return;
      }
    
      // Try to directly check if we have a newly created booking
      if (newBooking) {
        console.log("Using new booking without API fetch");
        setBookings([newBooking]);
        setLoading(false);
        return; // Skip API call if we already have the new booking
      }
      
      console.log(`Attempting to fetch bookings for user ID: ${user._id}`);
      
      try {
        // Direct fetch without retries for simplicity
        const response = await fetch(`${API_URL}/api/bookings/user/${user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token || ''}`
          }
        });
        
        console.log('Fetch Response Status:', response.status);
        
        // If 404, we'll just show "No bookings found" instead of treating it as an error
        if (response.status === 404) {
          console.log('No bookings found for this user');
          setBookings([]);
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Bookings data from API:', data);
        
        // Normalize data to ensure it's an array
        const bookingsArray = Array.isArray(data) 
          ? data 
          : data.bookings 
          ? data.bookings 
          : data.data 
          ? data.data 
          : [];
        
        setBookings(bookingsArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        // Show error but continue with empty bookings
        setError(`Unable to fetch bookings: ${err.message}`);
        setBookings([]);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, newBooking]);

  // Simplified loading state
  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your bookings...</p>
    </div>
  );

  return (
    <div className="success-container">
      <h1 className="heading center">Booking Confirmed!</h1>
      
      {error && (
        <div className="error-notice">
          <p>{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No Bookings Found</h2>
          <p>It seems you haven't made any bookings yet or the booking system is still updating.</p>
          <div className="no-bookings-actions">
            <button onClick={() => navigate('/rooms')}>
              Browse Available Rooms
            </button>
          </div>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id || Math.random()} className="booking-card">
              <div className="booking-header">
                <h2>{booking.roomName || booking.roomId?.name || 'Room Booking'}</h2>
                <span className="booking-status">
                  {booking.status || 'Confirmed'}
                </span>
              </div>
              <div className="booking-details">
                <div className="booking-dates">
                  <div className="check-in">
                    <strong>Check-In:</strong>
                    <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                  </div>
                  <div className="check-out">
                    <strong>Check-Out:</strong>
                    <p>{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {booking.roomId?.images && booking.roomId.images.length > 0 && (
                  <div className="booking-image">
                    <img 
                      src={booking.roomId.images[0]} 
                      alt={booking.roomName || booking.roomId.name} 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Success;