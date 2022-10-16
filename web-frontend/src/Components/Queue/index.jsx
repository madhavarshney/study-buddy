import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'

import { SocketContext, UserContext } from '../../utils/contexts'
import Nav from '../Nav'

// TODO: get userId from context
const Queue = () => {
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  const [currentView, setCurrentView] = useState('JOINING_QUEUE')
  const [queueUsers, setQueueUsers] = useState(null)
  const [userToPair, setUserToPair] = useState(null)
  const [respondToPairRequest, setRespondToPairRequest] = useState(null)

  const { classCode } = useParams()

  useEffect(() => {
    socket.emit('join-queue', { userId: user.id, classCode }, (res) => {
      if (res.status === 'error') {
        console.log('Error with joining queue:', res)
        setCurrentView('ERROR')
      } else {
        if (res.action === 'ADDED_TO_QUEUE') {
          setCurrentView('WAITING_FOR_OTHERS')
        } else if (res.action === 'RETURNED_QUEUE_USERS') {
          setCurrentView('CHOOSE_USER')
          setQueueUsers(res.users)
        }
      }
    })

    socket.on('accept-pair-request', (msg, callback) => {
      setCurrentView('RESPOND_TO_PAIR_REQUEST')
      setUserToPair(msg.user)
      setRespondToPairRequest(() => (response) => callback({ response }))
    })

    socket.on('paired', (msg) => {
      setCurrentView('PAIRED')
      setUserToPair(msg.user)
      setRespondToPairRequest(null)
      setQueueUsers(null)
    })

    return () => {
      // TODO: implement everything to clean up in here
      socket.off('accept-pair-request')
      socket.emit('leave-queue', { userId: user.id })
    }
  }, [classCode, user.id, socket])

  const sendPairRequest = (otherUser) => {
    setCurrentView('AWAITING_PAIR_RESPONSE')
    setUserToPair(otherUser)

    socket.emit(
      'send-pair-request',
      {
        userId: user.id,
        classCode,
        otherUserId: otherUser.id,
      },
      (res) => {
        if (res.action === 'REJECTED_PAIR_REQUEST') {
          setCurrentView('CHOOSE_USER')
        } else {
          // wait for paired event
        }
      }
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Nav />

      <div
        style={{
          padding: '1rem',
          width: '100%',
          flex: 1,
          background: '#f2f2f2',
        }}
      >
        {currentView === 'JOINING_QUEUE' ? (
          <div>Joining queue...</div>
        ) : currentView === 'WAITING_FOR_OTHERS' ? (
          <div>Waiting for others to pair...</div>
        ) : currentView === 'CHOOSE_USER' ? (
          <div style={{ width: '100%' }}>
            <h3>People to Pair</h3>
            <div style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
              {queueUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => sendPairRequest(user)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem',
                    overflow: 'auto',
                    borderRadius: 4,
                    background: 'white',
                    height: '80px',
                    boxShadow: '2px 2px 4px 0 #d2d2d2',
                  }}
                >
                  {user.name}: {user.email}
                </div>
              ))}
            </div>
          </div>
        ) : currentView === 'AWAITING_PAIR_RESPONSE' ? (
          <div>
            Sent pair request to {userToPair.name}, awaiting response...
          </div>
        ) : currentView === 'RESPOND_TO_PAIR_REQUEST' ? (
          <div>
            <div>
              <div>{userToPair.name}</div>
              <div>{userToPair.email}</div>
            </div>
            <div>
              <button onClick={() => respondToPairRequest('accept')}>
                Accept
              </button>
              <button
                onClick={() => {
                  respondToPairRequest('reject')
                  setCurrentView('WAITING_FOR_OTHERS')
                  setUserToPair(null)
                  setRespondToPairRequest(null)
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ) : currentView === 'PAIRED' ? (
          <div>
            <div>Paired Successfully! Here's how to contact your partner:</div>
            <div>{userToPair.name}</div>
            <div>{userToPair.email}</div>
          </div>
        ) : (
          <div>
            Uh oh, we had an issue joining the queue. Please reopen/refresh the
            app!
          </div>
        )}
      </div>
    </div>
  )
}

export default Queue
