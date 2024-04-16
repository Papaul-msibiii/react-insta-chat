import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ApiBaseUrl } from "../../http";
import { PaginationResults, TypeQuery } from "../user/user.type";
import { IMedecin, MedecinFormData } from "./medecin.type";
import { QueryUrl } from "../../Utils";
import { prepareHeaders } from "../user/user.api";
import { IConseils } from "../conseils/conseils.type";

export const MedecinApi = createApi({
    reducerPath: "medecinApi",
    tagTypes: [
      "medecin",
      "medecinList",
      "medecinByVisitor",
      "medecinBySlug",
      "allMedecinList",
      "avisByMedecin",
      "dashboardByMedecin",
      "disponibilitesByMedecin",
      "RdvsDayByMedecin",
      "conseilsByMedecin"
    ],
    baseQuery: fetchBaseQuery({
      baseUrl: `${ApiBaseUrl}/api/`,
      prepareHeaders,
    }),
    endpoints: (builder) => ({
      getListMedecin: builder.query<PaginationResults<IMedecin>, TypeQuery>({
        providesTags: ["medecinList"],
        query: (query) => QueryUrl("medecins/", query),
      }),
      getMedecinList: builder.query<any, void>({
        providesTags: ["medecin"],
        query: () => {
          return "/medecins/";
        },
      }),
      addOrEditMedecin: builder.mutation<IMedecin, { slug: string; data: MedecinFormData | FormData  }>({
        onCacheEntryAdded(arg, { dispatch }) {
          setTimeout(() => {
            dispatch(
              MedecinApi.util.invalidateTags([
                "medecinList",
                "medecinByVisitor",
                "medecin",
                "allMedecinList",
              ])
            );
          }, 1000);
        },
        query: ({ slug, data }) => {
          if (slug) {
            return {
              url: `medecins/${slug}/`,
              method: "PUT",
              body: data,
            };
          }
          return {
            url: `medecins/`,
            method: "POST",
            body: data,
          };
        },
      }),
      deleteMedecin: builder.mutation<IMedecin, string>({
        query: (id) => ({
          url: `users/${id}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["medecin","medecinList","medecinByVisitor","medecinBySlug","allMedecinList"],
      }),

      MedecinBySlug: builder.query<IMedecin | any, string>({
        query: (slug) => `medecins/${slug}/`,
        providesTags: ["medecinBySlug"],
      }),

      GetAvisByMedecin: builder.query<IMedecin | any, string>({
        query: (slug) => `medecin/${slug}/avis/`,
        providesTags: ["avisByMedecin"],
      }),

      GetDashboardByMedecin: builder.query<any, TypeQuery>({
        query: ({ slug, ...query }) => QueryUrl(`medecin/${slug}/dashboard/`, query),
        providesTags: ["dashboardByMedecin"],
      }),
      getConseilsByMedecin: builder.query<PaginationResults<IConseils>, TypeQuery>({
        query: ({ slug, ...query }) => QueryUrl(`medecin/${slug}/conseils/`, query),
        providesTags: ["conseilsByMedecin"],
      }),

      activateMedecinAccount: builder.mutation<IMedecin | any, string>({
        query: (slug) => ({
          url: `medecin/${slug}/validation/`,
          method: "GET"
        }),
        invalidatesTags: ["medecin","medecinList","medecinByVisitor"],
      }),


    }),
  });
  
  export const {
    useGetListMedecinQuery,
    useAddOrEditMedecinMutation,
    useDeleteMedecinMutation,
    useLazyMedecinBySlugQuery,
    useGetAvisByMedecinQuery,
    useGetDashboardByMedecinQuery,
    useGetMedecinListQuery,
    useGetConseilsByMedecinQuery,
    useActivateMedecinAccountMutation,
  } = MedecinApi;