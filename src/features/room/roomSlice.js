import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL; // Backend URL from environment variables

const initialState = {
  rooms: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create Room
export const createRoom = createAsyncThunk(
  "room/create",
  async (roomData, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(roomData),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      return await res.json();
    } catch (error) {
      console.log(error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Get All Rooms
export const getRooms = createAsyncThunk("room/getall", async (_, thunkApi) => {
  try {
    const res = await fetch(`${API_URL}/api/rooms`);
    if (!res.ok) {
      const error = await res.json();
      return thunkApi.rejectWithValue(error);
    }

    return await res.json();
  } catch (error) {
    console.log(error.message);
    return thunkApi.rejectWithValue(error.message);
  }
});

// Update Room
export const updateRoom = createAsyncThunk(
  "/room/update",
  async (roomData, thunkApi) => {
    try {
      const { roomId, ...rest } = roomData;
      const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        headers: {
          "Content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(rest),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      return await res.json();
    } catch (error) {
      console.log(error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Delete Room
export const deleteRoom = createAsyncThunk(
  "room/delete",
  async (roomId, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      return await res.json();
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
    builder
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.rooms = action.payload;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = state.rooms.filter(
          (room) => room._id !== action.payload.id
        );
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = roomSlice.actions;
export default roomSlice.reducer;
