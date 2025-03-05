import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

const API_URL = "https://bookings-backend-g8dm.onrender.com"

const Success = () => {
  const user = useSelector((state) => state.auth?.user); // Safe access

  // ✅ Memoize user bookings to prevent unnecessary re-renders
  const userId = useMemo(() => user?._id, [user]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;

      try {
        console.log("Fetching bookings for user ID:", userId);

        setLoading(true);
        const res = await fetch(`${API_URL}/api/bookings/user/${userId}`, { credentials: "include" });

        if (!res.ok) throw new Error(`Failed to fetch bookings (Status: ${res.status})`);

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]); // ✅ Only re-run effect when userId changes

  if (!userId) return <div className="error">You need to log in to view your bookings.</div>;
  if (loading) return <div className="loading">Fetching your bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 className="heading success center">Booking Successful</h1>

      {bookings.length === 0 ? (
        <p className="no-bookings">You have no previous bookings.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.roomName}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>{booking.status || "Confirmed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Success;
