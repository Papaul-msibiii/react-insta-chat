/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/self-closing-comp */
import axios, { AxiosRequestConfig } from 'axios'
import styles from './styles.module.css'
import * as React from 'react'
import Modal from 'react-bootstrap/Modal'
import {
  formatDateHour,
  getAvatar,
  getUserPseudo,
  truncateCaractere
} from './Utils'
import PropTypes from 'prop-types'
import { AiFillPlusCircle } from 'react-icons/ai'
import { BsCheck2All } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { ListGroup } from 'react-bootstrap'
import { getName } from './utils/Utils'
import { io } from 'socket.io-client'

const ReactInstaChat = ({
  user,
  token,
  conversationsUser,
  ApiBaseUrl,
  userList,
  socketUrl
}: any) => {
  const socket = io(socketUrl)
  console.log('user mod', user)
  console.log('token mod', token)
  const [showProfil, setShowProfil] = React.useState(true)
  const [modalNewChat, setModalNewChat] = React.useState<boolean>(false)
  const [listUser, setListUser] = React.useState(null)
  const [conversations, setConversations] = React.useState<any>([])
  const [receiver, setReceiver] = React.useState<any>(null)
  const [conversationActive, setConversationActive] = React.useState<any>(null)
  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<any>([])
  const [typingStatus, setTypingStatus] = React.useState<any>('')
  const lastMessageRef = React.useRef<any>(null)

  React.useEffect(() => {
    setConversations(conversationsUser)
  }, [conversationsUser])
  React.useEffect(() => {
    setListUser(userList)
  }, [userList])

  const handleSendMessage = async (e: any) => {
    e.preventDefault()
    if (message.trim()) {
      let data = {}
      if (receiver != null) {
        data = {
          content: message,
          sender: user?.id,
          receiver: receiver?.id
        }
      } else {
        data = {
          content: message,
          sender: user?.id,
          receiver: conversationActive?.participants?.find(
            (item: any) => item?.id !== user?.id
          )?.id,
          conversation: conversationActive?.id
        }
      }
      try {
        const response = await axios.post(
          ApiBaseUrl + '/api/messages/',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          } as AxiosRequestConfig
          // config
        )
        // setMessagePosted(true)
        setConversationActive(response?.data?.conversation)
        setMessages(response?.data?.conversation?.messages)
        socket.emit(`'message'`, response?.data)
        socket.emit('typing', ``)
        console.log('ok socket')
      } catch (error) {
        console.error(`Error: ${error}`)
      }
      setMessage('')
    }
  }

  React.useEffect(() => {
    const handleMessageResponse = (data: any) => {
      if ([data?.sender, data?.receiver].includes(user?.id)) {
        // setFetchData(true)
      }
    }

    socket.on('messageResponse', handleMessageResponse)

    return () => {
      socket.off('messageResponse', handleMessageResponse)
    }
  }, [])

  // const handleTyping = () => console.log('typing')
  const handleTyping = () =>
    socket.emit('typing', `${getName(user)} est en train d'écrire`)

  React.useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    socket.on('typingResponse', (data: any) => {
      setTypingStatus(data)
    })
  }, [socket])

  function openModalNewChat(e: any) {
    e.preventDefault()
    setModalNewChat(true)
  }

  const onChoseConvesation = async (x: any) => {
    setReceiver(null)
    setConversationActive(x)
    setMessages(x?.messages)
  }

  const [searchConv, setSearchConv] = React.useState('')

  const handleSearchConv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchConv(e.target.value)
  }
  const filteredConversationList = conversations?.filter((item: any) =>
    `${item?.participants?.find((p: any) => p.id !== user?.id)?.prenom} ${
      item?.participants?.find((p: any) => p.id !== user?.id)?.nom
    }`
      .toLowerCase()
      .includes(searchConv.toLowerCase())
  )
  return (
    <div className='dashbord-admin-component'>
      <div className='container dash-admin-page-content-container mb-3 py-2'>
        <div className='row'>
          <div className='col-lg-4 col-left-messagerie d-flex mb-3'>
            <div className={`${styles.customContentMessageLeft} w-100`}>
              <div
                className={`${styles.yadMessagerieTitreMessageContainer}  mb-4`}
              >
                <div className={styles.yadMessagerieTitreMessage}>Message</div>
                <button
                  onClick={(e) => openModalNewChat(e)}
                  className={`btn ${styles.yadMessagerieBtnAjout} ${styles.btnAddNewChat}`}
                >
                  <AiFillPlusCircle />
                </button>
                <NewChatModal
                  modalNewChat={modalNewChat}
                  setModalNewChat={setModalNewChat}
                  setReceiver={setReceiver}
                  setConversationActive={setConversationActive}
                  userList={listUser}
                  ApiBaseUrl={ApiBaseUrl}
                  conversations={conversations}
                  setMessages={setMessages}
                />
              </div>
              <div className='input-group mb-4'>
                <span
                  className={`input-group-text ${styles.yadMessagerieCustomInputAddon}`}
                  id='basic-addon1'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                  >
                    <path
                      d='M12.8645 11.3205H12.0515L11.7633 11.0426C12.7719 9.8694 13.3791 8.34624 13.3791 6.68929C13.3791 2.99461 10.3842 -0.000244141 6.68954 -0.000244141C2.99485 -0.000244141 0 2.99461 0 6.68929C0 10.384 2.99485 13.3788 6.68954 13.3788C8.34648 13.3788 9.86964 12.7716 11.0429 11.7631L11.3208 12.0512V12.8643L16.4666 17.9998L18 16.4663L12.8645 11.3205ZM6.68954 11.3205C4.12693 11.3205 2.05832 9.2519 2.05832 6.68929C2.05832 4.12669 4.12693 2.05807 6.68954 2.05807C9.25214 2.05807 11.3208 4.12669 11.3208 6.68929C11.3208 9.2519 9.25214 11.3205 6.68954 11.3205Z'
                      fill='#C9CED6'
                    />
                  </svg>
                </span>
                <input
                  type='text'
                  className={`form-control ${styles.yadMessagerieCustomInputSearch}`}
                  placeholder='Recherche'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  value={searchConv}
                  onChange={handleSearchConv}
                />
              </div>
              <ListGroup
                className={`list-group list-group-flush ${styles.yadMessagerieCustomListGroup}`}
              >
                {!!filteredConversationList &&
                filteredConversationList?.length > 0 ? (
                  filteredConversationList?.map((item: any) => (
                    <ListGroup.Item
                      type='button'
                      className={`btn  ${styles.listGroupItem} ${
                        styles.listGroupItemAction
                      } ${item?.id === conversationActive?.id && 'active'}`}
                      aria-current='true'
                      key={item?.id}
                      onClick={() => onChoseConvesation(item)}
                    >
                      <div
                        className={`${styles.yadMessagerieListGroupAvatarContainer} d-flex`}
                      >
                        {item?.participants?.find(
                          (item: any) => item?.id !== user?.id
                        )?.avatar &&
                        showProfil &&
                        item?.participants?.find(
                          (item: any) => item?.id !== user?.id
                        )?.avatar !== '/mediafiles/avatars/default.png' ? (
                          <img
                            // src={
                            //   ApiBaseUrl +
                            //   item?.participants?.find(
                            //     (item: any) => item?.id !== user?.id
                            //   )?.avatar
                            // }
                            src={getAvatar(
                              item?.participants?.find(
                                (item: any) => item?.id !== user?.id
                              )?.avatar
                            )}
                            className={styles.yadMessagerieListGroupAvatar}
                            alt='Photo'
                            onError={() => setShowProfil(false)}
                          />
                        ) : (
                          <div className={styles.formatPseudo}>
                            {getUserPseudo(
                              item?.participants?.find(
                                (item: any) => item?.id !== user?.id
                              )
                            )}
                          </div>
                        )}
                        {item?.en_ligne ? (
                          <div
                            className={
                              styles.yadMessagerieListGroupAvatarIndicator
                            }
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='10'
                              height='10'
                              viewBox='0 0 10 10'
                              fill='none'
                            >
                              <circle
                                cx='5'
                                cy='4.99976'
                                r='4.5'
                                fill='#2CC84A'
                                stroke='white'
                              />
                            </svg>
                          </div>
                        ) : (
                          <div
                            className={
                              styles.yadMessagerieListGroupAvatarIndicator
                            }
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='10'
                              height='10'
                              viewBox='0 0 10 10'
                              fill='none'
                            >
                              <circle
                                cx='5'
                                cy='4.99976'
                                r='4.5'
                                fill='#F2F2F2'
                                stroke='white'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className='w-100'>
                        <div
                          className={styles.yadMessagerieListGroupNameContainer}
                        >
                          <div
                            className={`${styles.yadMessagerieListGroupName} m-r-7`}
                          >
                            {
                              item?.participants?.find(
                                (item: any) => item?.id !== user?.id
                              )?.prenom
                            }{' '}
                            {
                              item?.participants?.find(
                                (item: any) => item?.id !== user?.id
                              )?.nom
                            }
                          </div>
                          <div className={styles.yadMessagerieListGroupHeure}>
                            {formatDateHour(
                              item?.messages[item?.messages?.length - 1]
                                ?.created_at
                            )}
                          </div>
                        </div>
                        <div className={styles.yadMessagerieListGroupApercu}>
                          {truncateCaractere(
                            item?.messages[item?.messages?.length - 1]?.content,
                            18
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          styles.yadMessagerieListGroupCheckIconContainer
                        }
                      >
                        <BsCheck2All
                          className={styles.yadMessagerieListGroupCheckIcon}
                        />
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div>Pas de donnée</div>
                )}
              </ListGroup>
            </div>
          </div>
          <div className={`col-lg-8 ${styles.colRightMessagerie} d-flex mb-3`}>
            {conversationActive != null || receiver != null ? (
              <div className={`${styles.dtailsMessagesTabsComponent} w-100`}>
                <div
                  className={styles.contentContentDetailMessageInfoContainer}
                >
                  <div
                    className={`${styles.contentContentDetailMessageInfo} p-3`}
                  >
                    <div className={styles.contentImgPpChat}>
                      {conversationActive == null ? (
                        receiver?.avatar &&
                        showProfil &&
                        receiver?.avatar !==
                          '/mediafiles/avatars/default.png' ? (
                          <img
                            src={ApiBaseUrl + receiver?.avatar}
                            className={`${styles.imageProfilEntete} image_responsive`}
                            alt='Photo'
                            onError={() => setShowProfil(false)}
                          />
                        ) : (
                          <div className={styles.formatPseudo}>
                            {getUserPseudo(receiver)}
                          </div>
                        )
                      ) : conversationActive?.participants?.find(
                          (item: any) => item?.id !== user?.id
                        )?.avatar &&
                        showProfil &&
                        conversationActive?.participants?.find(
                          (item: any) => item?.id !== user?.id
                        )?.avatar !== '/mediafiles/avatars/default.png' ? (
                        <img
                          src={
                            ApiBaseUrl +
                            conversationActive?.participants?.find(
                              (item: any) => item?.id !== user?.id
                            )?.avatar
                          }
                          className={`${styles.imageProfilEntete} image_responsive`}
                          alt='Photo'
                          onError={() => setShowProfil(false)}
                        />
                      ) : (
                        <div className={styles.formatPseudo}>
                          {getUserPseudo(
                            conversationActive?.participants?.find(
                              (item: any) => item?.id !== user?.id
                            )
                          )}
                        </div>
                      )}

                      <div
                        className={styles.yadMessagerieDetailMesAvatarIndicator}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='10'
                          height='10'
                          viewBox='0 0 10 10'
                          fill='none'
                        >
                          <circle
                            cx='5'
                            cy='4.99976'
                            r='4.5'
                            fill='#2CC84A'
                            stroke='white'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='content-info-user-chat'>
                      <div className='msg-user-infos-container'>
                        <div className='d-flex align-items-center msg-user-name'>
                          <p className={`${styles.profilDetailMessage} mb-0`}>
                            {conversationActive == null
                              ? receiver?.prenom + ' ' + receiver?.nom
                              : conversationActive?.participants?.find(
                                  (item: any) => item?.id !== user?.id
                                )?.prenom +
                                ' ' +
                                conversationActive?.participants?.find(
                                  (item: any) => item?.id !== user?.id
                                )?.nom}
                          </p>
                        </div>
                        <div className='bloc-user-disconnect-time msg-user-lastonline'>
                          <p className={`${styles.textDisconnectTime} mb-0`}>
                            En ligne
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {location?.pathname?.startsWith('/medecin/messages') ? (
                    <div className={styles.yadMessageBtnPhotoContainer}>
                      <button
                        className={`btn ${styles.yadMessageBtnPhoto}`}
                        //   onClick={() => setIsShowModalAppelVideo(true)}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='25'
                          height='25'
                          viewBox='0 0 25 25'
                          fill='none'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M16.0814 13.019C16.0814 11.2098 14.6143 9.74268 12.8051 9.74268C10.9959 9.74268 9.52875 11.2098 9.52875 13.019C9.52875 14.8282 10.9959 16.2953 12.8051 16.2953C14.6143 16.2953 16.0814 14.8282 16.0814 13.019Z'
                            stroke='#9E9E9E'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M12.8047 21.0418C21.1852 21.0418 22.183 18.5309 22.183 13.0901C22.183 9.27648 21.6786 7.23591 18.5021 6.35871C18.2104 6.26661 17.887 6.09117 17.6249 5.80279C17.2017 5.33897 16.8925 3.91463 15.8705 3.48371C14.8486 3.05389 10.7444 3.07362 9.73895 3.48371C8.73457 3.8949 8.40781 5.33897 7.98457 5.80279C7.72251 6.09117 7.40014 6.26661 7.10737 6.35871C3.93084 7.23591 3.42645 9.27648 3.42645 13.0901C3.42645 18.5309 4.42426 21.0418 12.8047 21.0418Z'
                            stroke='#9E9E9E'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M17.9214 9.37508H17.9307'
                            stroke='#9E9E9E'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                      <button
                        className={`btn ${styles.yadMessageBtnPhoto}`}
                        //   onClick={() => setIsShowModalAppelVocal(true)}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='22'
                          height='22'
                          viewBox='0 0 22 22'
                          fill='none'
                        >
                          <path
                            d='M20.1719 14.1395L20.1377 13.3952L14.303 12.5618L13.1195 14.8784C11.87 14.1748 10.7277 13.2959 9.72744 12.2684C8.68847 11.2697 7.80316 10.1227 7.10034 8.86457L9.62034 7.60457L7.10034 1.73657L6.41634 1.83557C5.25792 1.99515 4.18469 2.53303 3.36354 3.36557C0.50784 6.21767 1.62654 11.8094 5.90874 16.0907C8.59254 18.7736 11.7884 20.2145 14.5046 20.2136C15.2638 20.24 16.0206 20.114 16.7303 19.8431C17.44 19.5721 18.0882 19.1616 18.6365 18.6359C19.1967 18.0381 19.6233 17.3281 19.888 16.5529C20.1527 15.7776 20.2495 14.955 20.1719 14.1395ZM17.3639 17.3633C15.2939 19.4333 10.631 18.2633 7.18134 14.8181C3.73164 11.3729 2.56614 6.70547 4.63614 4.63547C5.022 4.24443 5.49427 3.94941 6.01494 3.77417L7.29294 6.75587L6.29664 7.25357C6.08082 7.36166 5.88882 7.51185 5.73194 7.69528C5.57506 7.87872 5.45647 8.0917 5.38317 8.32167C5.30987 8.55164 5.28333 8.79396 5.30512 9.03435C5.32691 9.27473 5.39658 9.50833 5.51004 9.72137C6.29785 11.1327 7.28851 12.4209 8.45034 13.5446C9.57437 14.6934 10.8573 15.6751 12.26 16.4597C12.4763 16.577 12.7138 16.65 12.9586 16.6743C13.2034 16.6985 13.4506 16.6736 13.6856 16.601C13.9155 16.5294 14.1285 16.412 14.3116 16.2557C14.4948 16.0995 14.6444 15.9077 14.7512 15.692L15.3335 14.5274L18.3638 14.9603C18.3293 15.8552 17.9744 16.708 17.3639 17.3633Z'
                            fill='#AEAEB2'
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.yadMessageBtnPhotoContainer}>
                      <button className={`btn ${styles.yadMessageBtnPhoto}`}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='36'
                          height='36'
                          viewBox='0 0 36 36'
                          fill='none'
                        >
                          <circle cx='18' cy='18' r='18' fill='#F8F8FB' />
                          <g opacity='0.4'>
                            <path
                              d='M18 18.75C17.5858 18.75 17.25 18.4142 17.25 18C17.25 17.5858 17.5858 17.25 18 17.25C18.4142 17.25 18.75 17.5858 18.75 18C18.75 18.4142 18.4142 18.75 18 18.75Z'
                              fill='#102844'
                              stroke='black'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M18 13.5C17.5858 13.5 17.25 13.1642 17.25 12.75C17.25 12.3358 17.5858 12 18 12C18.4142 12 18.75 12.3358 18.75 12.75C18.75 13.1642 18.4142 13.5 18 13.5Z'
                              fill='#102844'
                              stroke='black'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M18 24C17.5858 24 17.25 23.6642 17.25 23.25C17.25 22.8358 17.5858 22.5 18 22.5C18.4142 22.5 18.75 22.8358 18.75 23.25C18.75 23.6642 18.4142 24 18 24Z'
                              fill='#102844'
                              stroke='black'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </g>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className={`${styles.blocDetails} pb-5`}>
                  {messages?.map((message: any) => (
                    <div key={message?.id}>
                      {message?.sender?.id !== user?.id ? (
                        <div className='position-relative received-msg-item m-b-2'>
                          <div className={`${styles.blocMessageRecu} p-3`}>
                            <div className='content-img-pp-message-recieve'>
                              {message?.receiver?.avatar &&
                              showProfil &&
                              message?.receiver?.avatar !==
                                '/mediafiles/avatars/default.png' ? (
                                <img
                                  src={ApiBaseUrl + message?.receiver?.avatar}
                                  className={styles.imgPpMessageRecieve}
                                  alt='Photo'
                                  onError={() => setShowProfil(false)}
                                />
                              ) : (
                                <div className={styles.formatPseudo}>
                                  {getUserPseudo(message?.receiver)}
                                </div>
                              )}
                            </div>
                            <div className='info-text-message-recu'>
                              <div className='d-flex flex-column'>
                                <span className={styles.textMessageRecu}>
                                  {message?.content}
                                </span>
                              </div>
                              <p className={`${styles.timeDetailMessage} mt-3`}>
                                {formatDateHour(message?.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.blocReponse}>
                          <div className='position-relative sending-msg-item'>
                            <div className={styles.blocMessageEnvoyer}>
                              <span className={styles.textMessageEnvoyer}>
                                {message?.content}
                              </span>
                            </div>
                            <p className={`${styles.timeDetailMessage} mt-3`}>
                              {formatDateHour(message?.created_at)}
                            </p>
                            {/* <p className="time-detail-message mt-3 text-right">
                      Delivered{" "}
                      <BsCheck2All className="yad-messagerie-list-group-check-icon details-mes" />
                    </p> */}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className=''>{typingStatus}</div>
                  <div ref={lastMessageRef} />
                </div>
                <div
                  className={`${styles.textAreaFormContainer} p-3 border-top`}
                >
                  <form onSubmit={handleSendMessage}>
                    <div className='left-footer'>
                      <div className={styles.leftFooterContainer}>
                        <div className={styles.inputGroup}>
                          <div className={styles.inputContainer}>
                            <div
                              className={styles.containerDisplayInputMessage}
                            >
                              <div className='share'>
                                <i className='fa-solid fa-link img-icon-chat'></i>
                              </div>
                              <div className='inp w-100'>
                                <textarea
                                  className={`${styles.messagerieCustomTextarrea} form-control`}
                                  rows={1}
                                  placeholder='Type your message here...'
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  onKeyDown={handleTyping}
                                ></textarea>
                              </div>
                            </div>
                            <div className='d-flex gap-2'>
                              <div className='emoji'>
                                <i
                                  className={`fa-regular fa-face-smile ${styles.imgIconChat} send`}
                                  id='mytextarea'
                                ></i>
                              </div>
                              {/* <RiSendPlaneFill type="submit" className="img-icon-chat send" /> */}
                            </div>
                            {/* <div className="emoji">
                          <button type="submit">
                            <RiSendPlaneFill className="img-icon-chat send" />
                          </button>
                        </div> */}
                          </div>
                        </div>
                        <div className={styles.btnContainer}>
                          <button type='submit'>
                            <i className='fa-solid fa-paper-plane'></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div
                className={`${styles.dtailsMessagesTabsComponent} w-100`}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ReactInstaChat.propTypes = {
  socketUrl: PropTypes.any, // Socket connection (optional)
  user: PropTypes.any, // User data (optional)
  token: PropTypes.any, // Authentication token (optional)
  ApiBaseUrl: PropTypes.any, // Authentication token (optional)
  conversationsUser: PropTypes.any, // Conversations data (optional)
  userList: PropTypes.any // Function for choosing a conversation
}

export default ReactInstaChat

function NewChatModal({
  modalNewChat,
  setModalNewChat,
  setReceiver,
  setConversationActive,
  userList,
  ApiBaseUrl,
  conversations,
  setMessages
}: any) {
  const [searchValue, setSearchValue] = React.useState('')

  const filteredUserList = userList?.filter((item: any) =>
    `${item?.prenom} ${item?.nom}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )
  // console.log({ filteredUserList })
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  function closeModalNewChat() {
    setModalNewChat(false)
  }

  const onChoseReceiver = (x: any) => {
    // Vérifier si l'utilisateur sélectionné a déjà une conversation active
    const existingConversation = conversations.find((conversation: any) =>
      conversation.participants.some(
        (participant: any) => participant.id === x.id
      )
    )

    if (existingConversation) {
      // Si une conversation existe déjà avec cet utilisateur, afficher les messages de cette conversation
      setConversationActive(existingConversation)
      setReceiver(null) // Réinitialiser le destinataire
      setMessages(existingConversation?.messages) // afficher l'historique de messages
      closeModalNewChat() // Fermer la modal de nouvelle conversation
    } else {
      // Si aucune conversation active avec cet utilisateur, définir le destinataire et réinitialiser la conversation active et l'historique de messages
      setReceiver(x)
      setConversationActive(null)
      setMessages(null)
      closeModalNewChat() // Fermer la modal de nouvelle conversation
    }
  }

  return (
    <Modal show={modalNewChat} onHide={() => closeModalNewChat()}>
      <Modal.Header className='modal-header border-0 p-3' closeButton>
        <Modal.Title>Nouvelle discussion</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyMessenger}>
        <div className='pt-3'>
          <div className='form-search-user-container position-relative'>
            <input
              type='text'
              className={`${styles.formSearchUser} form-control`}
              placeholder='Rechercher des personnes'
              value={searchValue}
              onChange={handleSearchChange}
            />
            <FiSearch
              style={{
                color: '#919EAB',
                fontSize: 22,
                position: 'absolute',
                top: '25%',
                left: '2%'
              }}
            />
          </div>
        </div>
        <ul className={`${styles.userForSendMessageContainer} mt-3  px-2`}>
          {filteredUserList?.length > 0 ? (
            filteredUserList?.map((item: any) => (
              <li
                className={`${styles.userForSendMessage}  mb-3 px-3 py-1`}
                data-bs-dismiss='modal'
                key={'chatable_user_' + item.id}
                onClick={() => onChoseReceiver(item)}
              >
                <button className='btn no-link'>
                  <div className='d-flex align-items-center gap-2'>
                    <div>
                      {item?.avatar !== '/mediafiles/avatars/default.png' ? (
                        <img
                          src={ApiBaseUrl + item?.avatar}
                          alt='user-avatar'
                          className={`w-fluid ${styles.imgProfilUserMessage}`}
                        />
                      ) : (
                        <div className={styles.formatPseudo}>
                          {getUserPseudo(item)}
                        </div>
                      )}
                    </div>
                    <div className={styles.userForSendMessageInfos}>
                      <h3 className='mb-0'>
                        {item?.prenom} {item?.nom}
                      </h3>
                    </div>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <div>Pas de donnée</div>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  )
}
