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
        return `${pluralize(name.replace('_', '-'))}/${id}`+ (populate ? '?populate=*' : '')
      }
    }),
    getEntities: builder.query({
      query: (arg) => {
        const { name, populate } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate=*'
        console.log(query);
        return query
      }
    }),
    getEntitiesByDepth: builder.query({
      query: (arg) => {
        const { name, populate, depthField} = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate[0]=' + depthField;
        console.log("query");
        console.log(query);
        return query
      }
    }),
    getEntitiesByDepth2: builder.query({
      query: (arg) => {
        const { name, populate, depthField1, depthField2} = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate[' + depthField1 + '][populate][0]=' + depthField2;
        console.log("query");
        console.log(query);
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
    }),
    getMessages: builder.query({
      query: (gameroom) => `messages?filters[gameroom][id]=${gameroom}&populate=*&pagination[pageSize]=1000`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // create a websocket connection when the cache subscription starts        
        const socket = io(process.env.REACT_APP_API_HOST);
        try {
          socket.on('connect', () => {
            console.log("connected to socket")
            //join the game room
            socket.emit("join", { gameroom: arg }, (error) => {
              console.log("joined the room:" + arg)
              if (error) return alert(error);
            });
          });

          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded
          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          socket.on('message', (message) => {
            updateCachedData((draft) => {
              draft.data.push(message);
              dispatch({
                type: `govsimApi/invalidateTags`,
                payload: [{ type: 'promise', id: 'LIST' }],
              });
            });
          });

          socket.on('new_party', (message) => {
            toast('A new party has joined the Game : ' + message.name)
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'party', id: 'LIST' }],
            });
          });


          socket.on('challenge_updated', (message) => {
            const user = JSON.parse(localStorage.getItem('user')).user
            if (message.to_player.id === user.id || message.from_player.id === user.id) {
              dispatch(showAlert({
                show: false
              }));
              //if the status is Accepted, then redirect to the game
              if (message.status === 'ACCEPTED') {
                window.location = '/game/' + message.game.url + '/' + message.id;
              }

            }
          });

          socket.on('challenge', (message) => {
            const user = JSON.parse(localStorage.getItem('user')).user
            if (message.to_player.id === user.id) {
              dispatch(showAlert({
                show: true,
                title: 'Challenge',
                showSpinner: true,
                message: 'You have been challenged by ' + message.from_player.name + ' for a game of ' + message.game.name,
                msgBody: message,
                showConfirmButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Accept',
                denyButtonText: `Reject`,
              }));
            }
            if (message.from_player.id === user.id) {
              dispatch(showAlert({
                show: true,
                title: 'Challenge',
                showSpinner: true,
                message: 'Your challenge has been sent to ' + message.to_player.name + ' for a game of ' + message.game.name,
                msgBody: message,
                timer: 60000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true
              }));
            }
          });

          socket.on('election_finished', (message) => {
            dispatch(showAlert({
              show: false,
            }));

            setTimeout(() => {
              dispatch(showAlert({
                show: true,
                showSpinner: false,
                title: 'Elections',
                message: 'Elections result are out',
              }));
            }, 100);


            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'country', id: 'LIST' }, { type: 'party', id: 'LIST' }],
            });
          });


        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        socket.off('connect');
        socket.off('message');
      },
      providesTags: (result, error, arg) => [{ type: 'message', id: 'LIST' }],
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
  useGetEntitiesByFieldsQuery,
  useGetEntitiesByFieldQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddEntityMutation,
  useGetRatingMutation,
  useUpdateEntityMutation,
  useUpdateMessagesReadMutation,
  useCreateSessionMutation,
  useGetSessionMutation,
  useGetMessagesQuery
} = lastmealApi
