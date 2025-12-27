import "./Signup_Login_Page.css";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Logo from "../ui/components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getToken, isTokenExpired, Login } from "../services/authenticationService";

export default function LoginPage({onLogin}) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    try {
      const result = await Login(email, password);
      console.log(result);

      if(onLogin && result?.user){
        onLogin(result.user);
      }
      
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="page_container">
      <Row content="center" type="horizontal">
        <div className="box_container">
          <Row content="center" type="horizontal" margin="0.5rem">
            <Logo></Logo>
          </Row>
          <Row type="vertical" gap="1rem">
            <input
              className="login_input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              className="login_input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </Row>
          <Row gap="0.2rem" margin="0.5rem">
            <p> Don't have an account?</p>
            <a className="login_url" href="/signup">
              Signup
            </a>
          </Row>
          <Row
            gap="1rem"
            margin="1rem 0 0 0"
            content="center"
            type="horizontal"
          >
            {error && <p className="error">{error}</p>}
            <Link to="/" className="home-button-wrapper">
              <Button>Back</Button>
            </Link>
            <Button onClick={handleLogin}>Login</Button>
          </Row>
        </div>
      </Row>
    </div>
  );
}
