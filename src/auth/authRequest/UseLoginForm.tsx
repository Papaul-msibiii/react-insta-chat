/* eslint-disable camelcase */
import { useEffect } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
// import {
//   onSetUserToken,
//   onSetUserTokenOnLocalStorage
// } from '../../../redux/slice/User.slice'
// import { useAppDispatch } from '../../../../src/redux/hook'
import {
  onSetUserToken,
  onSetUserTokenOnLocalStorage
} from '../../redux/slice/User.slice'
import { cleannerError } from '../../utils/Utils'
import { AppLocalStorage } from '../../utils/storage'
import { useLoginUserMutation } from '../../utils/api/auth/auth.api'
// eslint-disable-next-line no-unused-vars
import { LoginFormData } from '../../utils/api/auth/auth.type'
import { useAppDispatch } from '../../redux/hook'

function UseLoginForm(socket: any) {
  const validationSchema = yup.object().shape({
    email: yup.string().email().required().label("L'email"),
    password: yup.string().required().label('Le mot de passe')
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loginUser, { isLoading }] = useLoginUserMutation()

  useEffect(() => {
    cleannerError(errors, clearErrors)
  }, [errors])

  const onSubmit = async (data: LoginFormData) => {
    // console.log("data login", data);
    const { remember_me, ...rest } = data

    const res = await loginUser(rest)

    if ('data' in res) {
      const user = res.data.data
      if (user?.user_type === 'patient') {
        setError('email', {
          message: 'Connexion non autorisée!'
        })
      } else {
        const path: string = '/messages'
        if (remember_me) {
          AppLocalStorage.setItem('remember', remember_me ? 1 : 0)
          dispatch(
            onSetUserTokenOnLocalStorage({
              user: res.data.data,
              token: res.data.token
            })
          )
        } else {
          dispatch(
            onSetUserToken({ user: res.data.data, token: res.data.token })
          )
        }

        socket.emit('newUser', {
          userName: user?.prenom + ' ' + user?.nom,
          socketID: socket.id
        })

        // if (isAdmin(user)) {
        //   path = '/admin/dashboard'
        // } else if (isMedecin(user)) {
        //   path = '/medecin/dashboard'
        // } else {
        //   path = '/'
        // }
        navigate(path)
      }
    }
    if ('error' in res) {
      const err = res.error as any
      const message = err?.data?.message
        ? err?.data?.message
        : err?.status < 500
        ? 'Email ou mot de passe incorrect'
        : `Une erreur de statut ${err?.status} est survenue.`
      setError('email', {
        message: message
      })
    }
  }

  return {
    register,
    errors: errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading
  }
}

export default UseLoginForm
