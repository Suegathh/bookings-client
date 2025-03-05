import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createBooking, reset } from "../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";

const API_URL = "https://bookings-backend-g8dm.onrender.com"

const Booking = () => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, isLoading, isError, message } = useSelector((state) => state.booking);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const { name, email, checkInDate, checkOutDate } = formData;

  // ✅ Fetch Room Details
  useEffect(() => {
    const getRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`, { credentials: "include" });

        if (!res.ok) throw new Error(`Room not found (Status: ${res.status})`);

        const data = await res.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getRoom();
  }, [roomId]);

  // ✅ Redirect on Successful Booking
  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/success");
    }
  }, [isSuccess, dispatch, navigate]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Validate and Submit Booking
 
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // ✅ Retrieve the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
  
    // ✅ Redirect to login if the user is not logged in
    if (!user || !user._id) {
      navigate("/login"); // Redirect to login page
      return;
    }
  
    const userId = user._id;
  
    // ✅ Ensure required fields are filled
    if (!name.trim() || !email.trim() || !checkInDate || !checkOutDate) {
      alert("Please fill in all fields.");
      return;
    }
  
    // ✅ Ensure check-in is today or later
    const today = new Date().toISOString().split("T")[0];
    if (checkInDate < today) {
      alert("Check-in date cannot be in the past.");
      return;
    }
  
    // ✅ Ensure check-out is after check-in
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      alert("Check-out date must be after check-in date.");
      return;
    }
  
    // ✅ Prepare the booking data
    const dataToSubmit = {
      roomId,
      userId, // Now the userId is included properly
      name,
      email,
      checkInDate,
      checkOutDate,
    };
  
    console.log("📤 Dispatching booking:", dataToSubmit);
  
    // ✅ Dispatch the booking action
    dispatch(createBooking(dataToSubmit));
  };
  
  

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!room) return <div className="error">Room not found</div>;

  return (
    <div>
      <h1 className="heading center">Book {room.name}</h1>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" value={name} placeholder="Enter full name" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} placeholder="Enter your email" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="checkInDate">Check-In Date</label>
            <input type="date" name="checkInDate" value={checkInDate} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="checkOutDate">Check-Out Date</label>
            <input type="date" name="checkOutDate" value={checkOutDate} onChange={handleChange} required />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
