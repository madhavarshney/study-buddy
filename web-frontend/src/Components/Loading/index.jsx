import './style.css'

const Loading = ({ style, children }) => (
  <div style={style} className="stage">
    <p className="loading loading_text">
      {children}
      <span className="loading_dots"></span>
    </p>
  </div>
)

export default Loading
