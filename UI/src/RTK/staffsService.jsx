// ...existing code...
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const staffApi = createApi({
  reducerPath: "staffApi",
  tagTypes: ["Staff"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders: (headers, { getState }) => {
      const tokenFromState = getState()?.auth?.token;
      const token = tokenFromState;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStaffs: builder.query({
      query: () => "/staff",
      providesTags: ["Staff"],
    }),
    addStaff: builder.mutation({
      query: (staffData) => ({
        url: "/staff",
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const { useGetStaffsQuery, useAddStaffMutation } = staffApi;
