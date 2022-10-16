import './style.css'
export default (props) => (
  <div style={props.style} class="stage">
    <p class="loading loading_text">{props.children}</p>
  </div>
)
