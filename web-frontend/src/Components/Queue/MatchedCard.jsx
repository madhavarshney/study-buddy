import { Avatar, Button } from '@mui/material'

const MatchedCard = ({
  style,
  user: { name, email, profilePicture },
  handleAccept,
  handleReject,
}) => (
  <div style={style}>
    <Avatar
      style={{ width: '96px', height: '96px' }}
      src={profilePicture}
      alt={name}
      imgProps={{ referrerPolicy: 'no-referrer' }}
    />

    <h2 style={{ marginBottom: 0 }}>{name}</h2>
    <div style={{ paddingBottom: '10px', marginBottom: '1rem' }}>{email}</div>

    <Button
      style={{ marginRight: '1rem' }}
      variant="contained"
      color="success"
      onClick={handleAccept}
    >
      Accept
    </Button>
    <Button variant="outlined" color="error" onClick={handleReject}>
      Reject
    </Button>
  </div>
)

export default MatchedCard
