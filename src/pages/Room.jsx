import "./Room.scss";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, reset } from "../features/room/roomSlice";
import Carousel from "../components/Carousel";

const API_URL = "https://bookings-backend-g8dm.onrender.com"
const Room = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuccess } = useSelector((state) => state.room);

  useEffect(() => {
    const getRoom = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/rooms/${id}`, { credentials: "include" });

        if (!res.ok) {
          console.error("Failed to fetch room");
          navigate("/rooms"); // Redirect if room not found
          return;
        }

        const data = await res.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
        navigate("/rooms"); // Redirect on error
      } finally {
        setIsLoading(false);
      }
    };

    getRoom();
  }, [id, navigate]);

  const handleDelete = () => {
    dispatch(deleteRoom(id));
  };

  if (isLoading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (!room) {
    return <div className="error">Room not found</div>;
  }

  return (
    <div id="room">
      <div className="container">
        <div>
          <div className="img-wrapper">
            {/* ✅ Ensure room.img exists and is an array */}
            <Carousel data={room.img && Array.isArray(room.img) ? room.img : []} />
          </div>
          <div className="text-wrapper">
            <h1 className="heading center">{room.name || "No Name"}</h1>
            <p>{room.desc || "No description available"}</p>
            <h2>${room.price ? Number(room.price).toFixed(2) : "N/A"}</h2>
          </div>
          <div className="cta-wrapper">
            <Link to={`/bookings/${room._id}`}>Book Now</Link>
            {room.isAdmin && (
              <>
                <Link to={`/edit/rooms/${room._id}`}>Edit Room</Link>
                <button onClick={handleDelete}>Delete Room</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
