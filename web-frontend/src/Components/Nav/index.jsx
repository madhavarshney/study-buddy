const DummyCircle = () => (
  <div
    style={{ width: 32, height: 32, borderRadius: '50%', background: '#ccc' }}
  />
)

const Nav = () => {
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
      <DummyCircle />
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
        Study Buddies
      </div>
      <DummyCircle />
    </div>
  )
}

export default Nav
