import "./Button.css";
function Button({ onClick }) {
  return (
    <button className="button" onClick={onClick}>
      <span className="shadow"></span>
      <span className="edge"></span>
      <div className="front">
        <span>Click me</span>
      </div>
    </button>
  );
}
export default Button;
