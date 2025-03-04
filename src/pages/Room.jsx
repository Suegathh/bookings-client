import "./Room.scss";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, reset } from "../features/room/roomSlice";
import Carousel from "../components/Carousel";

const Room = () => {
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRoom = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/rooms/${id}`);
        
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        } else {
          // Handle unsuccessful response
          console.error('Failed to fetch room');
          navigate('/rooms'); // Redirect if room not found
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        navigate('/rooms'); // Redirect on error
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
    return <div>Loading...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div id="room">
      <div className="container">
        <div>
          <div className="img-wrapper">
            {/* Ensure room.img exists and is an array */}
            <Carousel 
              data={room.img && room.img.length > 0 ? room.img : []} 
            />
          </div>
          <div className="text-wrapper">
            <h1 className="heading center">{room.name}</h1>
            <p>{room.desc}</p>
            <h2>${room.price ? room.price.toFixed(2) : 'N/A'}</h2>
          </div>
          <div className="cta-wrapper">
            <Link to={`/bookings/${room._id}`}>Book Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;