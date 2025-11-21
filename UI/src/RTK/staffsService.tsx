import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const staffApi = createApi({
    reducerPath: 'staffApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/staffs',
    }),
    endpoints: (builder) => ({
        getStaffs: builder.query({
            query: () => '/getStaffs',
        }),
    })
})

export const { useGetStaffsQuery } = staffApi;