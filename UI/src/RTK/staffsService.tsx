import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const staffApi = createApi({
    reducerPath: 'doctorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
    }),
    endpoints: (builder) => ({
        getStaffs: builder.query<{name:string}, void>({
            query: () => '/getStaffs',
        }),
    })
})

export const { useGetStaffsQuery } = staffApi;