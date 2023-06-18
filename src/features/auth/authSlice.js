import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "../../helpers/axios.helpers";
import helpers from '../../helpers'
// ----------------------------------------------------------

const initialState = {
    user: helpers.isJsonString(window.localStorage.user) ? JSON.parse(window.localStorage.user) : null,
    status: 'idle', // idle || loading || succeeded || failed
    error: null,
    forgetPasswordStatus: 'idle', // idle || loading || succeeded || failed
    forgetPasswordError: null,
    resetPasswordStatus: 'idle', // idle || loading || succeeded || failed
    resetPasswordError: null,
    changePasswordStatus: 'idle', // idle || loading || succeeded || failed
    changePasswordError: null,
    tokenStatus: 'idle',
    tokenError: null,

};

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    try {
        const response = await axiosPublic.post('/accounts/authenticate', { email, password })
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

export const refreshToken = createAsyncThunk('auth/refresh-token', async (_, { getState }) => {
    try {
        var state = getState();
        if (state?.auth?.user?.refreshToken) {
            const response = await axiosPublic.post('/accounts/refresh-token', { refreshToken: state?.auth?.user?.refreshToken })
            return response.data
        }
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

export const forgetPassword = createAsyncThunk('auth/forget-password', async ({ email }) => {
    try {
        const response = await axiosPublic.post('/accounts/forgot-password', { email })
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

export const registerPassword = createAsyncThunk('auth/register', async ({ code, name, password, acceptTerms }) => {
    try {
        const response = await axiosPublic.post(`/accounts/register/${code}`, { name, password, acceptTerms })
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

export const verifyCode = createAsyncThunk('auth/verify-code', async ({ code }) => {
    try {
        const response = await axiosPublic.get(`/accounts/invitation/${code}`)
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})


export const resetPassword = createAsyncThunk('auth/reset-password', async ({ code, password, confirmPassword }) => {
    try {
        const response = await axiosPublic.post('/accounts/reset-password', { token: code, password, confirmPassword })
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

export const changePassword = createAsyncThunk('auth/change-password', async ({ oldPassword, password }) => {
    try {
        const response = await axiosPrivate.post('/accounts/change-password', { password, oldPassword })
        return response.data
    } catch (err) {
        console.log(err.message)
        return Promise.reject(err.message)
    }
})

/*
validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}*/

export const init = createAsyncThunk('auth/init', async (_, { getState }) => {
    const user = getState()?.auth?.user;

    let currentDate = new Date();
    if (user?.refreshToken) {
        if (user?.accessToken && new Date(user.accessTokenExpiry) < currentDate.getTime()) {
            const response = await axiosPublic.post('/accounts/refresh-token', { refreshToken: user.refreshToken })
            return response.data
        }
    }
    return user
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            window.localStorage.user = null;
        },
        reset: (state) => {
            state.error = null
            state.status = 'idle'
        }
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // TODO: Perform transformation like link replacement
                if (action.payload) {
                    state.user = action.payload
                    window.localStorage.user = JSON.stringify(action.payload)
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(refreshToken.pending, (state) => {
                state.tokenStatus = 'loading'
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.tokenStatus = 'succeeded'
                state.user = action.payload
                window.localStorage.user = JSON.stringify(action.payload)
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.tokenStatus = 'failed'
                state.tokenError = action.error.message
            })
            .addCase(init.pending, (state) => {
                state.tokenStatus = 'loading'
            })
            .addCase(init.fulfilled, (state, action) => {
                state.tokenStatus = 'succeeded'
                if (action.payload) {
                    state.user = action.payload
                    window.localStorage.user = JSON.stringify(action.payload)
                }
            })
            .addCase(init.rejected, (state, action) => {
                state.tokenStatus = 'failed'
                state.tokenError = action.error.message
            })
            .addCase(forgetPassword.pending, (state) => {
                state.forgetPasswordStatus = 'loading'
            })
            .addCase(forgetPassword.fulfilled, (state) => {
                state.forgetPasswordStatus = 'succeeded'
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.forgetPasswordStatus = 'failed'
                state.forgetPasswordError = action.error.message
            })
            .addCase(registerPassword.pending, (state) => {
                state.tokenStatus = 'loading'
            })
            .addCase(registerPassword.fulfilled, (state) => {
                state.status = 'succeeded'
            })
            .addCase(registerPassword.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(verifyCode.pending, (state) => {
                state.tokenStatus = 'loading'
            })
            .addCase(verifyCode.fulfilled, (state) => {
                state.status = 'succeeded'
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(changePassword.pending, (state) => {
                state.changPasswordStatus = 'loading'
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changPasswordStatus = 'succeeded'
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changPasswordStatus = 'failed'
                state.changPasswordError = action.error.message
            })
            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordStatus = 'loading'
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPasswordStatus = 'succeeded'
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPasswordStatus = 'failed'
                state.resetPasswordError = action.error.message
            })
    }
})

export const loggedInUser = (state) => state.auth.user;
export const isLoggedIn = (state) => state.auth.user != null;
export const getLoginStatus = (state) => state.auth.status;
export const getLoginError = (state) => state.auth.error;
export const getTokenStatus = (state) => state.auth.tokenStatus;
export const getTokenError = (state) => state.auth.tokenError;
export const getForgetPasswordStatus = (state) => state.auth.forgetPasswordStatus;
export const getForgetPasswordError = (state) => state.auth.forgetPasswordError;
export const getResetPasswordStatus = (state) => state.auth.resetPasswordStatus;
export const getResetPasswordError = (state) => state.auth.resetPasswordError;
export const getChangePasswordStatus = (state) => state.auth.changPasswordStatus;
export const getChangePasswordError = (state) => state.auth.changPasswordError;

export const { logout, reset } = authSlice.actions;

export default authSlice.reducer;
