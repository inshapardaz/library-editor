import { createApi } from "@reduxjs/toolkit/query/react";

// local Imports
import axiosBaseQuery from "@/utils/axiosBaseQuery";
// ----------------------------------------------------------

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        changePassword: builder.mutation({
            query: ({ oldPassword, password }) => ({
                url: '/accounts/change-password',
                method: "POST",
                data: {
                    password,
                    oldPassword,
                },
            })
        }),
        forgetPassword: builder.mutation({
            query: ({ email }) => ({
                url: '/accounts/forgot-password',
                method: "POST",
                data: {
                    email,
                },
            })
        }),
        register: builder.mutation({
            query: ({ code, name, password, acceptTerms }) => ({
                url: `/accounts/register/${code}`,
                method: "POST",
                data: {
                    name,
                    password,
                    acceptTerms,
                },
            })
        }),
    })
})

export const {
    useChangePasswordMutation,
    useForgetPasswordMutation,
    useRegisterMutation
} = authApi