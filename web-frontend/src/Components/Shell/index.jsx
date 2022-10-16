import Nav from '../Nav'

const Shell = ({ children, footer }) => {
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
          overflow: 'auto',
        }}
      >
        {children}
      </div>

      {footer}
    </div>
  )
}

export default Shell
