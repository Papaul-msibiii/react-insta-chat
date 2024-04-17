/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import $ from 'jquery'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ApiBaseUrl } from './http'
import Avatar1 from '../assets/avatar.png'
import moment from 'moment'

export const onHide = (modalId: string) => {
  document.getElementById(modalId)?.classList.remove('show')
  $('.modal-backdrop').remove()
  $(`#${modalId}`).hide()
  $(`#${modalId}`).click()
  $(`body`).css({ overflowY: 'scroll' })
  $(`#${modalId}`).click()
}

export function getName(item: any) {
  if (item && item !== undefined) {
    return item?.prenom + ' ' + item?.nom
  }
  return ''
}

export function useLocationState<T>(
  defaultValue: T | any,
  redirectToWhenNull: string | null = null
): T {
  const state = useLocation().state as T
  const navigate = useNavigate()
  useEffect(() => {
    if (!state && redirectToWhenNull) {
      navigate(redirectToWhenNull)
    }
  }, [state])
  return state || defaultValue
}

export const getAvatar = (avatar: string | any) => {
  if (avatar && !avatar.includes('default.png')) {
    if (avatar.indexOf('http') === 0) return avatar
    return ApiBaseUrl + avatar
  }
  return Avatar1
}

export function getUserPseudo(user?: any) {
  if (user) {
    return (user?.prenom?.charAt(0) + '.' + user?.nom?.charAt(0))?.toUpperCase()
  }
  return 'Y.D'
}

export const formatDateHour = (date: moment.MomentInput) => {
  return moment(date).format('DD/MM/YYYY à HH:mm:ss')
}

export const truncateCaractere = (str: string | null, nbr: number) => {
  return str != null && str.length > nbr ? str.substring(0, nbr) + '...' : str
}
