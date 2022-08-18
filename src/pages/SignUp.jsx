import { useState } from "react";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {toast} from 'react-toastify'
import {setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {db} from '../firebase.config'
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowKeyIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
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
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user
      updateProfile(auth.currentUser, {
        displayName : name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, "users", user.uid), formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error("Something went wrong!")
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
          className="nameInput"
          placeholder="Name"
          id="name"
          value={name}
          onChange={onChange}
        />

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

        <div className="signUpBar">
          <p className="signUpText">
            Sign Up
          </p>
          <button className="signUpButton">
            <ArrowKeyIcon fill="#fff" width='34px' height='34px' />
          </button>
        </div>
      </form>

      <OAuth />

        <Link className="registerLink" to='/signin'>
          Sign In Instead
        </Link>
    </div>
  );
}

export default SignUp;
