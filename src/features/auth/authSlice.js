import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Get user from localStorage (for persistent login)
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = "https://bookings-backend-g8dm.onrender.com"

// Register user
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
  
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });
  

// Login user
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
  
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });
  

// Logout user
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Logout failed");

    localStorage.removeItem("user");
    return null; // Return null to reset user state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "An error occurred during logout");
  }
});

const authSlice = createSlice({
  name: "auth",
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.message = "Registration successful!";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.message = "Login successful!";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = true;
        state.message = "Logged out successfully!";
      })
      .addCase(logout.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
