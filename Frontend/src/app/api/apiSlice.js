import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://yazaki-api.onrender.com' }),
    tagTypes: [ 'User'],
    endpoints: builder => ({})
})