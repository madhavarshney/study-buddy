import { Button } from '@mui/material'
const ProfilePicutre = (props) => (
  <div
    style={{
      width: '6rem',
      height: '6rem',
      borderRadius: '50%',
      background: '#ccc',
      overflow: 'hidden',
    }}
  >
    {props.user && (
      <img
        style={{ width: '100%', height: '100%' }}
        src={props.user.profilePicture}
        alt={`profile for ${props.user.name}`}
      />
    )}
  </div>
)
const MatchedCard = (props) => (
  <div style={props.style}>
    <ProfilePicutre {...props} />
    <h2>{props.user.name}</h2>
    <div style={{ paddingBottom: '10px' }}>{props.user.email}</div>
    <Button
      style={{ marginRight: '1rem' }}
      variant="contained"
      color="success"
      onClick={props.handleAccept}
    >
      Accept
    </Button>
    <Button variant="outlined" color="error" onClick={props.handleReject}>
      Reject
    </Button>
  </div>
)

export default MatchedCard
