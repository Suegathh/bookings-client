import { getRooms, reset } from "../features/room/roomSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import RoomList from "../components/RoomList"

const Rooms = () => {
  const dispatch = useDispatch();
  const { rooms, isLoading, isError } = useSelector((state) => state.room);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    dispatch(getRooms());
    
    // Only reset after rooms are fetched
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container">
        <h1 className="heading center">Loading Rooms...</h1>
        {/* Consider adding a loading spinner */}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="container">
        <h1 className="heading center">Error Loading Rooms</h1>
        <p className="error-message">Unable to fetch rooms. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <h1 className="heading center">Rooms</h1>
        {rooms.length > 0 ? (
          <RoomList data={rooms} />
        ) : (
          <p className="no-rooms-message">No rooms available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Rooms;