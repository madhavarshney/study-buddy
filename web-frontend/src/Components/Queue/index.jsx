import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'

import { SocketContext, UserContext } from '../../utils/contexts'
import Loading from '../Loading'
import Shell from '../Shell'
import Profile from '../Profile'

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
    <Shell>
      {currentView === 'JOINING_QUEUE' ? (
        <Loading>Joining queue</Loading>
      ) : currentView === 'WAITING_FOR_OTHERS' ? (
        <Loading>Waiting for others to pair</Loading>
      ) : currentView === 'CHOOSE_USER' ? (
        <div style={{ width: '100%' }}>
          <h3>People to Pair</h3>
          <div style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
            {queueUsers.map((user) => (
              <Profile
                key={user.id}
                user={user}
                onClick={() => sendPairRequest(user)}
              />
            ))}
          </div>
        </div>
      ) : currentView === 'AWAITING_PAIR_RESPONSE' ? (
        <Loading>
          Sent pair request to {userToPair.name}, awaiting response
        </Loading>
      ) : currentView === 'RESPOND_TO_PAIR_REQUEST' ? (
        <div>
          {userToPair && (
            <Profile user={userToPair}>
              <Button
                onClick={() => {
                  respondToPairRequest('reject')
                  setCurrentView('WAITING_FOR_OTHERS')
                  setUserToPair(null)
                  setRespondToPairRequest(null)
                }}
              >
                Reject
              </Button>
              <Button
                variant="outlined"
                onClick={() => respondToPairRequest('accept')}
              >
                Accept
              </Button>
            </Profile>
          )}
        </div>
      ) : currentView === 'PAIRED' ? (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            Paired Successfully! Here's your partner:
          </div>
          {userToPair && <Profile user={userToPair} />}
        </div>
      ) : (
        <div>
          Uh oh, we had an issue joining the queue. Please reopen/refresh the
          app!
        </div>
      )}
    </Shell>
  )
}

export default Queue
