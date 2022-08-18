import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { ReactComponent as ArrowKeyIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  };

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      if(userCredentials.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error("Bad user credentials!")
    }

  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">welcome back</p>
      </header>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="emailInput"
          placeholder="Email"
          id="email"
          value={email}
          onChange={onChange}
        />

        <div className="passwordInputDiv">
          <input
            type={showPassword ? "text" : "password"}
            className="passwordInput"
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />
          <img src={VisibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)} />
        </div>

        <Link className="forgotPasswordLink" to="/forgot-password">forgot password</Link>

        <div className="signInBar">
          <p className="signInText">
            Sign In
          </p>
          <button className="signInButton">
            <ArrowKeyIcon fill="#fff" width='34px' height='34px' />
          </button>
        </div>
      </form>

      <OAuth />

      <Link className="registerLink" to='/signup'>
        Sign Up Instead
      </Link>
    </div>
  );
}

export default SignIn;
