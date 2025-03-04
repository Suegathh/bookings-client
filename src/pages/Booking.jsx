import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createBooking, reset } from "../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const Booking = () => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.booking);

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

  useEffect(() => {
    const getRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`, { credentials: "include" });

        if (!res.ok) {
          throw new Error("Room not found");
        }

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

  useEffect(() => {
    if (isSuccess) {
      navigate("/success");
      dispatch(reset());
    }
  }, [isSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate dates
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const dataToSubmit = {
      roomId,
      name,
      email,
      checkInDate,
      checkOutDate,
    };

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

          <button type="submit">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
