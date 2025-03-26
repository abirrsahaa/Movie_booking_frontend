import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Interface for decoded token
interface DecodedToken {
  email: string;
  exp: number;
  // Add other token fields as needed
}

// User State Interface
interface UserState {
  userData: {
    id: number;
    email: string;
    name?: string;
    avatar?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: UserState = {
  userData: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Async Thunk for Verifying Token and Fetching User Details
export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      // Decode token to get email
      const decoded = jwtDecode<DecodedToken>(token);
      console.log(decoded);

      // Fetch user details using email from token
      const stringg='http://localhost:9090/api/user/'+decoded.email;
      console.log(stringg);
      const response = await axios.get('http://localhost:9090/api/user/'+decoded.email, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      console.log(response);

      return {
        token,
        userData: response.data
      };
    } catch (error) {
      // Remove token if verification fails
      localStorage.removeItem('token');
      return rejectWithValue('Authentication failed');
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    dispatch(userSlice.actions.resetUser());
  }
);

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.userData = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.userData;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userData = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;