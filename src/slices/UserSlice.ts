import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Interface for decoded token
interface DecodedToken {
  email: string;
  exp: number;
  // Add other token fields as needed
}

// Update Profile Input Interface
interface UpdateProfileInput {
  name?: string;

  phone?: string;
}

// User State Interface
interface UserState {
  userData: {
    id: number;
    email: string;
    name?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
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
      const stringg = 'http://localhost:9090/api/user/' + decoded.email;
      console.log(stringg);
      const response = await axios.get('http://localhost:9090/api/user/' + decoded.email, {
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

// Async Thunk for Updating Profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: UpdateProfileInput, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.token;

    if (!token) {
      return rejectWithValue('No authentication token');
    }

    console.log(profileData);

    try {
      const res = await axios.put(
        'http://localhost:9090/api/user/update',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("the res is ", res.data);

      const decoded = jwtDecode<DecodedToken>(token);
      const response = await axios.get(`http://localhost:9090/api/user/${decoded.email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;



      // return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to update profile'
        );
      }
      return rejectWithValue('An unexpected error occurred');
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
      // Authentication Cases
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
      })

      // Update Profile Cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user data with the response from the server
        state.userData = {
          ...state.userData,
          ...action.payload
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;