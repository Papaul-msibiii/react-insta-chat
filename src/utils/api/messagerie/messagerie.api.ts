/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { ApiBaseUrl } from '../../http'
import { QueryUrl } from '../../Utils'
import { prepareHeaders } from '../user/user.api'
import { PaginationResults, TypeQuery } from '../user/user.type'
import { IMessagerie } from './messagerie.type'

export const MessagerieApi = createApi({
  reducerPath: 'messagerieApi',
  tagTypes: [
    'messagerieList',
    'messagerieBySlug',
    'allMessageriesList',
    'conversationByUser',
    'messagesByConversation'
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiBaseUrl}/api/`,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getAllMessagerieList: builder.query<any, void>({
      providesTags: ['allMessageriesList'],
      query: () => {
        return 'messages/'
      }
    }),
    getListMessageries: builder.query<
      PaginationResults<IMessagerie>,
      TypeQuery
    >({
      providesTags: ['messagerieList'],
      query: (query) => QueryUrl('messages/', query)
    }),

    addOrEditMessagerie: builder.mutation<
      IMessagerie,
      { slug?: string; data: IMessagerie | FormData }
    >({
      query: ({ slug, data }) => ({
        url: slug ? `messages/${slug}/` : `messages/`,
        method: slug ? 'PUT' : 'POST',
        body: data
      }),
      invalidatesTags: ['messagerieList', 'conversationByUser']
    }),
    deleteMessagerie: builder.mutation<IMessagerie, string>({
      query: (slug) => ({
        url: `messages/${slug}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['messagerieList']
    }),
    messagerieBySlug: builder.query<IMessagerie | any, string>({
      query: (slug) => `messages/${slug}/`,
      providesTags: ['messagerieBySlug']
    }),
    conversationByUser: builder.query<
      PaginationResults<IMessagerie>,
      TypeQuery
    >({
      query: (query) => QueryUrl(`user/${query?.slug}/conversations/`, query),
      providesTags: ['conversationByUser']
    }),
    messagesByConversation: builder.query<IMessagerie | any, string>({
      query: (slug) => `Conversation/${slug}/messages/`,
      providesTags: ['messagesByConversation']
    })
  })
})

export const {
  useGetAllMessagerieListQuery,
  useAddOrEditMessagerieMutation,
  useGetListMessageriesQuery,
  useLazyMessagerieBySlugQuery,
  useDeleteMessagerieMutation,
  useLazyConversationByUserQuery,
  useConversationByUserQuery,
  useMessagesByConversationQuery
} = MessagerieApi
