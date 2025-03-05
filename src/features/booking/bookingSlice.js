import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://booking-backend-bice.vercel.app"; // ✅ Backend URL

const initialState = {
  booking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkApi) => {
    try {
      // ✅ Retrieve user ID from localStorage (or Redux store)
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user._id : null;

      // ✅ Include `userId` in booking data
      const newBookingData = { ...bookingData, userId };

      console.log("📦 Sending Booking Data:", newBookingData); // Debugging

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBookingData),
      });

      const data = await res.json();
      console.log("📤 Server Response:", data); // Debugging

      if (!res.ok) {
        return thunkApi.rejectWithValue(data.message || "Booking failed");
      }

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);


export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;
