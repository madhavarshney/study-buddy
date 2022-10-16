import useSWR from 'swr'
import { useNavigate } from 'react-router-dom'

import fetcher from '../../utils/fetcher'
import Nav from '../Nav/index'

const Home = ({ userId, isConnected }) => {
    const navigate = useNavigate()

    // TODO: handle errors
    const { data: user, error } = useSWR(`/users/${userId}`, fetcher)
    const { data: classes, error: error2 } = useSWR(
        `/users/${userId}/classes`,
        fetcher
    )

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
                {/* <h2 style={{ textAlign: 'center' }}>Welcome, {user.name}</h2> */}

                {classes && (
                    <div style={{ width: '100%' }}>
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
            </div>

            <div style={{ padding: '1rem' }}>
                Connected to server: {isConnected ? 'yes' : 'no'}
                {user && (
                    <div>
                        <div>Name: {user.name}</div>
                        <div>Email: {user.email}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
