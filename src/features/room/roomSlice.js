import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Use environment variable for API base URL
const API_URL = "https://bookings-backend-g8dm.onrender.com/api/rooms";

// Initial state
const initialState = {
  rooms: [],
  selectedRoom: null, // ✅ Store single-room details separately
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ✅ Centralized fetch wrapper for consistent error handling
const fetchWrapper = async (url, options = {}) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : "";

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include", // ✅ Ensure this matches backend CORS
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

// ✅ **Create a Room**
export const createRoom = createAsyncThunk(
  "room/create",
  async (roomData, thunkApi) => {
    try {
      return await fetchWrapper(API_URL, {
        method: "POST",
        body: JSON.stringify(roomData),
      });
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const getRooms = createAsyncThunk("room/getAll", async (_, thunkApi) => {
  try {
    const response = await fetchWrapper(`${API_URL}`);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const getRoom = createAsyncThunk(
  "room/getOne",
  async (roomId, thunkApi) => {
    try {
      return await fetchWrapper(`${API_URL}/${roomId}`);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const updateRoom = createAsyncThunk(
  "room/update",
  async ({ roomId, ...roomData }, thunkApi) => {
    try {
      return await fetchWrapper(`${API_URL}/${roomId}`, {
        method: "PUT",
        body: JSON.stringify(roomData),
      });
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "room/delete",
  async (roomId, thunkApi) => {
    try {
      await fetchWrapper(`${API_URL}/${roomId}`, { method: "DELETE" });
      return { id: roomId };
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    const handlePendingState = (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    };

    const handleRejectedState = (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload || "An error occurred";
    };

    builder
      // ✅ Create Room
      .addCase(createRoom.pending, handlePendingState)
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, handleRejectedState)

      // ✅ Get All Rooms
      .addCase(getRooms.pending, handlePendingState)
      .addCase(getRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, handleRejectedState)

      // ✅ Get Single Room
      .addCase(getRoom.pending, handlePendingState)
      .addCase(getRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedRoom = action.payload; // ✅ Store single-room data correctly
      })
      .addCase(getRoom.rejected, handleRejectedState)

      // ✅ Update Room
      .addCase(updateRoom.pending, handlePendingState)
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        );
      })
      .addCase(updateRoom.rejected, handleRejectedState)

      // ✅ Delete Room
      .addCase(deleteRoom.pending, handlePendingState)
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = state.rooms.filter((room) => room._id !== action.payload.id);
      })
      .addCase(deleteRoom.rejected, handleRejectedState);
  },
});

export const { reset } = roomSlice.actions;
export default roomSlice.reducer;
