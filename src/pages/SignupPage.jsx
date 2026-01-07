import {Link, useNavigate} from "react-router-dom";
import "./Signup_Login_Page.css";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Logo from "../ui/components/Logo";
import { useState } from "react";
import { SignUp } from "../services/authenticationService";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError]= useState("");

  async function handleSignup() {
    setError("");
    try{
      const result =await SignUp(username, email, password);
      console.log(result);
      navigate("/login");
    } catch (err){
      console.error(err);
      setError(err.message || "SignUp failed");
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
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
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
            <p> Already have an account?</p>
            <a className="login_url" href="/login">
              Login
            </a>
          </Row>
          <Row
            gap="1rem"
            margin="1rem 0 0 0"
            content="center"
            type="horizontal"
          >
            <Link to="/home" className="home-button-wrapper">
              <Button>Back</Button>
            </Link>
            <Button onClick={handleSignup}>Signup</Button>
          </Row>
        </div>
      </Row>
    </div>
  );
}
