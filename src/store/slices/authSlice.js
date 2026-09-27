import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// local Imports
import { axiosPublic } from '@/utils/axios.helpers';
// ----------------------------------------------------------

const initialState = {
    user: null,
    status: "idle", // idle || loading || succeeded || failed
    error: null,
    forgetPasswordStatus: "idle", // idle || loading || succeeded || failed
    forgetPasswordError: null,
    resetPasswordStatus: "idle", // idle || loading || succeeded || failed
    resetPasswordError: null,
    loadUserStatus: "idle",
    loadUserError: null,
    tokenStatus: "idle",
    tokenError: null,
};

export const logout = createAsyncThunk(
    "auth/logout",
    async (user) => {
        try {
            const response = await axiosPublic.post("/accounts/revoke-token", {
                token: user?.accessToken
            });
            return response.data;
        } catch (e) {
            console.error(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const loadUser = createAsyncThunk(
    "auth/user",
    async () => {
        try {
            // Uses axiosPublic (not axiosPrivate) deliberately: this call runs on
            // every app load to silently probe the session cookie, which lives on
            // the API/main-site origin and can't be inspected from this app's own
            // document.cookie. axiosPrivate's 401 handler tries a token refresh and
            // then hard-redirects to the login page on failure, which would bounce
            // every anonymous visitor to login just for loading the header.
            const response = await axiosPublic.get("/accounts/user");
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    }
);


export const init = createAsyncThunk("auth/init", async (_, { dispatch }) => {
    // The refresh token cookie is httpOnly and cannot be read from JS, so we
    // can't gate this on its presence. Always attempt to load the user; the
    // request will simply fail (401) if there's no valid session.
    dispatch(loadUser())
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers(builder) {
        builder
            .addCase(logout.pending, (state) => {
                state.logoutStatus = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.logoutStatus = "succeeded";
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.logoutStatus = "failed";
                state.logoutUser = action.error.message;
            })
            .addCase(loadUser.pending, (state) => {
                state.loadUserStatus = "loading";
                state.loadUserError = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loadUserStatus = "succeeded";
                state.loadUserError = null;
                if (action.payload) {
                    state.user = action.payload;
                }
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loadUserStatus = "failed";
                state.loadUserError = action.error.message;
            });
    },
});

export const isLoggedIn = (state) => state?.auth?.user != null;
export const getLogoutStatus = (state) => state.auth.logoutStatus;
export const getLogoutError = (state) => state.auth.logoutError;
export const getUserStatus = (state) => state?.auth?.loadUserStatus;
export const getUserError = (state) => state?.auth?.loadUserError;
