// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { showAlert } from '../redux/actions';

// Define a service using a base URL and expected endpoints
export const lastmealApi = createApi({
  reducerPath: 'lastmealApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_DOMAIN}/api/`,
    prepareHeaders: (headers, { getState }) => {
      return headers
    },
  }),
  endpoints: (builder) => ({
    getEntity: builder.query({
      query: (arg) => {
        const { name, id, populate } = arg;
        return `${pluralize(name.replace('_', '-'))}/${id}` + (populate ? '?populate=*' : '')
      }
    }),
    getEntities: builder.query({
      query: (arg) => {
        const { name, populate } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate === true) {
          query += '?populate=*'
        } else if (populate !== undefined) {
          query += '?' + populate
        }
        console.log(query);
        return query
      }
    }),
    getEntitiesByDepth: builder.query({
      query: (arg) => {
        const { name, populate, depthField } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate[0]=' + depthField;
        console.log("query");
        console.log(query);
        return query
      }
    }),
    getEntitiesByDepth2: builder.query({
      query: (arg) => {
        const { name, populate, depthField1, depthField2 } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate[' + depthField1 + '][populate][0]=' + depthField2;
        console.log("query");
        console.log(query);
        return query
      }
    }),
    getNestedEntities: builder.query({
      query: (arg) => {
        const { name, populate, fields } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) {
          query += '?populate='
          for (const field of fields) {
            query += field + '.';
          }
        }
        console.log("nested query");
        console.log(query);
        return query
      }
    }),
    GetEntitiesByShape: builder.query({
      query: (arg) => {
        const { name, populate, shape } = arg;
        let query = `${pluralize(name.replace('_', '-'))}?` 
        if (populate) {
          for (const fieldGroup of shape) {
            query += 'populate='
            for (const field of fieldGroup) {
              query += field + '.';
            }
            query += '&'
          }
        }
        console.log(`query by shape: ${name}`, query);
        return query
      }
    }),
    getEntitiesByFields: builder.query({
      query: (arg) => {
        const { name, fields, values, relations } = arg;
        const filters = []
        for (let i = 0; i < fields.length; i++) {
          let f = fields[i]
          let v = values[i]
          let r = relations[i]
          if (r) {
            filters.push(`filters[${f}][$eq]=${v}&`)
          } else {
            filters.push(`filters[${f}][${r}][$eq]=${v}&`)
          }
        }
        return `${pluralize(name.replace('_', '-'))}?${filters.join('')}`
      }
    }),
    getEntitiesByField: builder.query({
      query: (arg) => {
        const { name, field, value, relation, populate } = arg;
        let query
        if (relation) {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][${relation}][$eq]=${value}`
        } else {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][$eq]=${value}`
        }
        if (populate === true) {
          query += '&populate=*'
        } else if (populate !== undefined) {
          query += '&' + populate
        }
        return query
      },
      providesTags: (result, error, arg) => [{ type: arg.name, id: 'LIST' }],
    }),
    addEntity: builder.mutation({
      query(arg) {
        const { name, body } = arg;
        return {
          url: `${pluralize(name.replace('_', '-'))}`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: arg.name, id: 'LIST' }]
        if (arg.name === 'vote') {
          tags.push({ type: 'promise', id: 'LIST' })
        }
        if (arg.name === 'promotion') {
          tags.push({ type: 'party', id: 'LIST' })
        }
        return tags
      },
    }),
    getRating: builder.mutation({
      query(arg) {
        const { body } = arg;
        return {
          url: `generate-rating`,
          method: 'POST',
          body,
        }
      },
    }),
    updateEntity: builder.mutation({
      query(arg) {
        const { name, body, id } = arg;
        return {
          url: `${pluralize(name.replace('_', '-'))}/${id}?populate=*`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: arg.name, id: 'LIST' }]
        return tags
      },
    }),
    updateMessagesRead: builder.mutation({
      query(arg) {
        const { body } = arg;
        return {
          url: `/messages/read`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: 'message', id: 'LIST' }]
        return tags
      },
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: `/auth/local`,
          method: 'POST',
          body,
        }
      },
    }),
    register: builder.mutation({
      query(body) {
        return {
          url: `/auth/local/register`,
          method: 'POST',
          body: { ...body, tokens: 0 },
        }
      },
    }),
    createSession: builder.mutation({
      query(body) {
        return {
          url: `/create_checkout_session`,
          method: 'POST',
          body: { data: body },
        }
      }
    }),
    getSession: builder.mutation({
      query(body) {
        return {
          url: `/checkout_session?sessionId=${body}`,
          method: 'GET',
        }
      },
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEntityQuery,
  useGetEntitiesQuery,
  useGetEntitiesByDepthQuery,
  useGetEntitiesByDepth2Query,
  useGetNestedEntitiesQuery,
  useGetEntitiesByShapeQuery,
  useGetEntitiesByFieldsQuery,
  useGetEntitiesByFieldQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddEntityMutation,
  useGetRatingMutation,
  useUpdateEntityMutation,
  useUpdateMessagesReadMutation,
  useCreateSessionMutation,
  useGetSessionMutation
} = lastmealApi
