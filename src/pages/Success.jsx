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
    // If we have a new booking from the navigation state, add it to our bookings list immediately
    if (newBooking) {
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
    
      let retries = 0;
      const maxRetries = 3;
      
      const fetchWithRetry = async () => {
        try {
          console.log(`Fetching bookings for user ID: ${user._id} (Attempt ${retries + 1})`);
      
          const response = await fetch(`${API_URL}/api/bookings/user/${user._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(user.token && { 'Authorization': `Bearer ${user.token}` })
            },
            credentials: 'include'
          });
      
          console.log('Fetch Response Status:', response.status);
          
          // Handle 404 "No bookings found" case gracefully
          if (response.status === 404) {
            console.log('API returned 404: No bookings found for this user');
            
            // If we have a new booking, keep it displayed
            if (newBooking) {
              console.log('Using new booking from navigation state instead');
              setLoading(false);
              return;
            }
            
            // If we have no new booking and this isn't our last retry, try again
            if (retries < maxRetries) {
              retries++;
              console.log(`Will retry in 2 seconds (Attempt ${retries + 1}/${maxRetries + 1})`);
              setTimeout(fetchWithRetry, 2000); // Wait 2 seconds before retrying
              return;
            }
            
            // All retries exhausted, show empty bookings
            setBookings([]);
            setLoading(false);
            return;
          }
      
          const data = await response.json();
          
          // Comprehensive logging of raw data
          console.log('Raw Fetch Data:', data);
  
          // Normalize data to ensure it's an array
          const bookingsArray = Array.isArray(data) 
            ? data 
            : data.bookings 
            ? data.bookings 
            : data.data 
            ? data.data 
            : [];
          
          console.log('Normalized Bookings:', {
            count: bookingsArray.length,
            bookings: bookingsArray.map(booking => ({
              id: booking._id,
              roomName: booking.roomId?.name || booking.roomName,
              checkIn: booking.checkInDate,
              checkOut: booking.checkOutDate
            }))
          });
      
          // If we have a new booking, make sure it's included and at the top of the list
          if (newBooking) {
            const existsInFetchedData = bookingsArray.some(b => b._id === newBooking._id);
            
            if (!existsInFetchedData) {
              bookingsArray.unshift(newBooking);
            }
          }
          
          setBookings(bookingsArray);
          setLoading(false);
        } catch (err) {
          console.error("Booking fetch error:", err);
          
          // If we have a new booking, show it despite the fetch error
          if (newBooking) {
            console.log('Using new booking from navigation state despite fetch error');
            setBookings([newBooking]);
            setLoading(false);
            return;
          }
          
          // Otherwise, retry on error too
          if (retries < maxRetries) {
            retries++;
            console.log(`Error occurred, will retry in 2 seconds (Attempt ${retries + 1}/${maxRetries + 1})`);
            setTimeout(fetchWithRetry, 2000);
            return;
          }
          
          setError(err.message || "Failed to fetch bookings");
          setLoading(false);
        }
      };

      fetchWithRetry();
    };

    fetchBookings();
  }, [user, newBooking]);

  // Display a custom message if we have a new booking but are still loading other bookings
  const isLoadingWithNewBooking = loading && newBooking;

  if (loading && !newBooking) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your bookings...</p>
    </div>
  );

  if (error && !newBooking) return (
    <div className="error-container">
      <h2>Booking Retrieval Error</h2>
      <p>{error}</p>
      <div className="error-actions">
        <button onClick={() => navigate('/rooms')}>Browse Rooms</button>
        <button onClick={() => navigate('/login')}>Log In</button>
      </div>
    </div>
  );

  const hasBookings = bookings.length > 0 || newBooking;

  return (
    <div className="success-container">
      <h1 className="heading center">Booking Confirmed!</h1>

      {isLoadingWithNewBooking && (
        <div className="loading-notice">
          <p>Displaying your new booking. Loading additional bookings...</p>
          <div className="small-spinner"></div>
        </div>
      )}

      {!hasBookings ? (
        <div className="no-bookings">
          <h2>No Bookings Found</h2>
          <p>It seems you haven't made any bookings yet.</p>
          <div className="no-bookings-actions">
            <button onClick={() => navigate('/rooms')}>
              Browse Available Rooms
            </button>
          </div>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
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