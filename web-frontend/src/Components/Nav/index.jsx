import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../../utils/contexts'
import IconSettings from '../icons/IconSettings'
import Logo from './Logo'

const Nav = () => {
  const user = useContext(UserContext)

  return (
    <div
      style={{
        display: 'flex',
        // justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        borderBottom: 'solid 1px #ccc',
      }}
    >
      <Link to="/settings">
        <IconSettings color="black" size={32} />
      </Link>

      <Logo />
      {/* <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
        Study Buddies
      </div> */}

      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#ccc',
          overflow: 'hidden',
        }}
      >
        {user && (
          <img
            style={{ width: '100%', height: '100%' }}
            src={user.profilePicture}
            alt={`profile for ${user.name}`}
          />
        )}
      </div>
    </div>
  )
}

export default Nav
