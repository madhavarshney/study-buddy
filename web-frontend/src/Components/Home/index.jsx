import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import fetcher from '../../utils/fetcher'
import { UserContext } from '../../utils/contexts'
import Shell from '../Shell'
import MyImage from './engineering_team.png'

const Home = ({ isConnected }) => {
  const navigate = useNavigate()
  const user = useContext(UserContext)

  // TODO: handle error and loading states
  const {
    data: classes,
    error,
    isLoading,
    isValidating,
  } = useSWR(user ? `/users/${user.id}/classes` : null, fetcher)

  useEffect(() => {
    if (classes && classes.length === 0 && !isLoading && !isValidating) {
      navigate('/settings')
    }
  }, [classes])

  return (
    <Shell
    // footer={
    //   // NOTE: this is only for debugging
    //   <div style={{ padding: '1rem' }}>
    //     Connected to server: {isConnected ? 'yes' : 'no'}
    //     {user && (
    //       <div>
    //         <div>Name: {user.name}</div>
    //         <div>Email: {user.email}</div>
    //       </div>
    //     )}
    //   </div>
    // }
    >
      {/* <h2 style={{ textAlign: 'center' }}>Welcome, {user.name}</h2> */}

      {classes && (
        <div style={{ width: '100%' }}>
          <img style={{ width: '400px', maxWidth: '100%' }} src={MyImage} />

          <h3>Choose Your Class</h3>
          <div style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
            {classes.map(({ code, title }) => (
              <div
                key={code}
                onClick={() => navigate(`/queue/${code}`)}
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
                {code}: {title}
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  )
}

export default Home
