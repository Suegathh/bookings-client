import "./App.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Room from "./pages/Room"
import Rooms from "./pages/Rooms"
import Header from "./components/Header"
import Booking from "./pages/Booking"
import Success from "./pages/Success"


const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/all/:id" element={<Room />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/bookings/:id" element={<Booking />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App