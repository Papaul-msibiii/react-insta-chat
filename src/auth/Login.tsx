import React, { useState } from 'react'
import './Login.css'
import { Link, NavLink } from 'react-router-dom'
// import Logo from '../../assets/appImages/logo.png'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import UseLoginForm from './authRequest/UseLoginForm'
// import UseLoginForm from './authRequest/UseLoginForm'
// import { FormError } from '../common/Input'
const Login = ({ socket }: any) => {
  // eslint-disable-next-line no-unused-vars
  const { register, errors, isLoading, onSubmit } = UseLoginForm(socket)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div>
      <div className='container-page-login'>
        <div className='auth-row row h-100'>
          <div className='col-md-5 auth-col auth-left-side-col d-flex'>
            <div className='auth-left-side-container' />
          </div>
          <div className='col-md-7 auth-col auth-right-side-col'>
            <div className='auth-right-side-container'>
              <div className='auth-form-container'>
                <div className='content-img-logo-login-app mb-4 text-center'>
                  {/* <img src={Logo} alt='Logo' className='img-logo-login-app' /> */}
                </div>
                <div className='content-text-message-login'>
                  <span className='auth-form-message'>Nouveau?</span>
                  <NavLink
                    to='/inscription'
                    className='btn-text-message-login ps-1'
                  >
                    Créer un compte
                  </NavLink>
                </div>
                <h1 className='auth-form-title mb-4'>Connectez-vous</h1>
                <div className='content-form-login-page'>
                  <form id='auth-form' onSubmit={onSubmit}>
                    <div className='row auth-form-row'>
                      <div className='col-md-12 auth-input-col mb-3'>
                        <div className='auth-form-group'>
                          <label className='form-label form-label-auth-login'>
                            Email
                          </label>
                          <input
                            type='email'
                            className='form-control auth-form-control-add'
                            id='email-or-username'
                            placeholder='Identifiant'
                            aria-label='Username'
                            {...register('email')}
                          />
                          {/* <FormError error={errors?.email?.message} /> */}
                        </div>
                      </div>
                      <div className='col-md-12 auth-input-col mb-2'>
                        <div className='auth-form-group'>
                          <label className='form-label form-label-auth-login'>
                            Mot de passe
                          </label>
                          <div className='input-with-eye-container'>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className='form-control auth-form-control-add'
                              id='password'
                              placeholder='Mot de passe'
                              aria-label='Password'
                              {...register('password')}
                            />
                            <span
                              className='show-hide-password'
                              onClick={() => {
                                setShowPassword(!showPassword)
                              }}
                            >
                              {showPassword ? (
                                <AiFillEyeInvisible />
                              ) : (
                                <AiFillEye />
                              )}
                            </span>
                          </div>
                          {/* <FormError error={errors?.password?.message} /> */}
                        </div>
                      </div>
                      <div className='col-md-12 auth-input-col mb-5'>
                        <div className='checkbox'>
                          <input
                            className='custom-checkbox'
                            type='checkbox'
                            id='checkbox'
                            // {...register('remember_me')}
                          />
                          <label htmlFor='checkbox'>Se souvenir de moi</label>
                        </div>
                      </div>
                      <div className='d-flex justify-content-end mb-3'>
                        <Link
                          to='/mot-de-passe-oublie'
                          className='forget-password-link'
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>
                      <div className='col-md-12 auth-submit-btn-container mt-4'>
                        <button
                          disabled={isLoading}
                          className='btn auth-submit-btn trans-0-2'
                          type='submit'
                        >
                          {isLoading ? (
                            <>
                              <span
                                className='spinner-border spinner-border-sm text-light me-1 d-inline-block'
                                role='status'
                              />
                              <span>Connexion...</span>
                            </>
                          ) : (
                            'Connexion'
                          )}
                        </button>
                        {/* <NavLink
                          to="/medecin/dashboard"
                          className="btn auth-submit-btn trans-0-2"
                        >
                          Connexion médecin
                        </NavLink>
                      </div>
                      <div className="col-md-12 auth-submit-btn-container mt-4">
                        <NavLink
                          to="/admin/dashboard"
                          className="btn auth-submit-btn trans-0-2"
                        >
                          Connexion admin
                        </NavLink> */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
