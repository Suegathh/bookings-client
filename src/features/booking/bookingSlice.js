import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ API Base URL (Ensure No Trailing Slash)
const API_URL = "https://bookings-backend-g8dm.onrender.com/api/bookings";

// ✅ Initial State
const initialState = {
  booking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ✅ Create Booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkApi) => {
    try {
      // ✅ Retrieve user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user._id : null;

      // ✅ Ensure `userId` is included in bookingData
      const newBookingData = { ...bookingData, userId };

      console.log("📦 Sending Booking Data:", newBookingData); // Debugging
      console.log("📦 Final Booking Data Sent:", newBookingData);

      const res = await fetch(`${API_URL}`, {
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


// ✅ Booking Slice
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
        console.log("✅ Booking created successfully:", action.payload);

      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

// ✅ Export Actions & Reducer
export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;
