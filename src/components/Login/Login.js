import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../App";
import navlogo from "../../components/assets/logo.png";
import LoginGoogle from "./GoogleLogin";


const Wrapper = styled.div`
  .auth-card {
    border: 1px solid #dbdbdb !important;
    box-shadow: none !important;
  }
  .login-input {
    border-radius: 999px !important;
    border: 1px solid #dbdbdb !important;
    padding: 0.1rem 0.5rem !important;
    width: 95% !important;
    height: 2rem !important;
  }
  .no-account {
    color: #0095f6 !important;
    font-weight: 600;
  }
  .reset {
    font-size: 0.8em;

    font-weight: 100 !important;
  }
  .nav-logo {
    margin-bottom: 30px;
    margin-top: 30px;
  }
  .btn {
    margin-top: 10px;
    font-weight: 600 !important;
    width: 100% !important;
    margin-bottom: 2em;
    border-radius: 999px !important;
  }
 
  .google-btn{
    border-radius: 999px !important;
    overflow: hidden;
    box-shadow: rgb(0 0 0 / 24%) 0px 0px 0px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px !important;
    border: 1px solid red;
    margin-top: 10px;
  }
  .error{
    color:#ed4956;
  }
  .hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: .5;
  &:before {
    content: '';
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }
  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;

    padding: 0 .5em;
    line-height: 1.5em;
    color: #818078;
    background-color: #fcfcfa;
  }
  }
`;

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [url, setUrl] = useState(undefined);
  const [load, setLoad] = useState(true);
  const [data,setData] = useState("")

  const PostData = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          // M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          setData(data)
          setLoad(true);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          //M.toast({html:"signed in success",classes:"#66bb6a green lighten-1"})
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      PostData();
      setLoad(false)
    }
  }


  return (
    <Wrapper>
      <div className="mycard">
        <div className="card auth-card">
         <img className="nav-logo" src={navlogo} alt="logo" /> 
          {/* <h2 className="brand-logo">Instagram</h2> */}
          <input
            className="login-input"
            type="text"
            placeholder="email"
            value={email.toLowerCase()}
            onKeyPress={handleKeyPress}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            className="login-input"
            type="password"
            placeholder="password"
            onKeyPress={handleKeyPress}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
       
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-2"
              onClick={() => {
                PostData();
                setLoad(false);
              }}
            >{load? "Login" : "loading..."}
              
            </button>
            <hr class="hr-text" data-content="OR"></hr>
            <LoginGoogle/>
          
          <p className="error">{data.error}</p>
          <div style={{ marginTop: "1em" }}>
            Dont have an account?{" "}
            <Link className="no-account" to="/signup">
              Sign up
            </Link>
          </div>
          <div>
            <Link className="reset" to="/reset">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Login;
