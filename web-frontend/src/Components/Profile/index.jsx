import { Avatar } from '@mui/material'

const Profile = ({
  user: { name, email, profilePicture },
  onClick,
  children,
}) => (
  <div
    onClick={onClick}
    style={{
      width: '100%',
      padding: '1rem 1rem',
      overflow: 'auto',
      borderRadius: 4,
      background: 'white',
      boxShadow: '2px 2px 4px 0 #d2d2d2',
    }}
  >
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar alt={name} href={profilePicture} referrerPolicy="no-referrer" />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{name}</div>
        <div>{email}</div>
      </div>
    </div>

    {children && (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem',
        }}
      >
        {children}
      </div>
    )}
  </div>
)

export default Profile
