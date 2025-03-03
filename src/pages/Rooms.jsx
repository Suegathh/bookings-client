import { getRooms, reset } from "../features/room/roomSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import RoomList from "../components/RoomList"

const Rooms = () => {
    const dispatch = useDispatch()
    const { rooms } = useSelector((state) => state.room)
    useEffect(() => { 
        dispatch(getRooms())
        dispatch(reset())
    }, [])
   
  return (
    <div>
      <div className="container">
        <h1 className="heading center">Rooms</h1>
        {rooms.length > 0 ? <RoomList data={rooms} /> : null}
      </div>
    </div>
  )
}

export default Rooms