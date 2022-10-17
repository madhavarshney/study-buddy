import { Avatar, Menu, MenuItem } from '@mui/material'
import { gapi } from 'gapi-script'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { UserContext } from '../../utils/contexts'
import IconSettings from '../icons/IconSettings'
import Logo from './Logo'

const ProfileMenu = ({ user }) => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <div
        id="profile-menu"
        aria-controls={anchorEl ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar
          style={{ width: 32, height: 32 }}
          src={user.profilePicture}
          alt={user.name}
          imgProps={{ referrerPolicy: 'no-referrer' }}
        />
      </div>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-menu',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            navigate('/settings')
          }}
        >
          Settings
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose()
            gapi.auth2.getAuthInstance().signOut()
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

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
      <Link to="/settings" style={{ lineHeight: 0 }}>
        <IconSettings color="black" size={32} />
      </Link>

      <Link
        to="/"
        style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}
      >
        <Logo />
      </Link>

      {user && <ProfileMenu user={user} />}
    </div>
  )
}

export default Nav
