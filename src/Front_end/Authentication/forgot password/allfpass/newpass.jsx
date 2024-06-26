import supabase from "../../../supabase.jsx";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import newpassCSS from "./newpass.module.css";
import bcrypt from "bcryptjs/dist/bcrypt.js";

function Newpass({ settoken, setmail }) {
  let navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); //for hide and showing the pass we alter the input type to accomplishn this//
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const togglePasswordVisibility2 = () =>
    setPasswordVisible2(!passwordVisible2);

  const [lowerValid, setLower] = useState(false);
  const [upperValid, setUpper] = useState(false);
  const [numValid, setNum] = useState(false);
  const [splValid, setSpl] = useState(false); //for checking the strength of the password//
  const [lenValid, setLen] = useState(false);
  const [allValid, setAllValid] = useState(false);

  //first made sure that the cons of the data being taken into are empty//

  const passRef = useRef("");
  const cpassRef = useRef("");

  const passwordChange = (value) => {
    console.log(passRef); //regexp searches for the specific pattern in strings and here we use to check our
    const lower = new RegExp("(?=.*[a-z])"); //requirements in the password ?= checks for a patter in string . for all characters
    const upper = new RegExp("(?=.*[A-Z])"); //of this pattern that we contain after it and * (basically to say except newline)for all those in that pattern that might repeat
    const num = new RegExp("(?=.*[0-9])"); //atleast once as we mentioned the pattern here//
    const len = new RegExp("(?=.*[\\S]{8,})");
    const spl = new RegExp("(?=.*[^a-zA-Z0-9s])"); // Matches any character except letters, numbers, and whitespace
    //here\ is used to strictly mean a specific spl char//
    setLower(lower.test(value));
    setUpper(upper.test(value));
    setNum(num.test(value));
    setLen(len.test(value));
    setSpl(spl.test(value));
    setAllValid(lowerValid && upperValid && numValid && splValid && lenValid);
  };
  async function signup(e) {
    e.preventDefault();

    const password = passRef.current.value; //used useRef because spreading and updating the data didn't work using usestate//
    const confirmPassword = cpassRef.current.value;

    if (!password || password.trim() === "") {
      alert("Please enter a password."); //!password is true and gives alert if the input is empty or password is not defined
      return; //but we also need to trim and check because the user might enter spaces and leave it blank//
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    let isPasswordStrong =
      lowerValid && upperValid && numValid && splValid && lenValid;
    setAllValid(isPasswordStrong);
    if (!allValid) {
      alert(
        "Password is not strong enough. Please ensure it meets the following criteria:\n- Minimum 8 characters\n- Lowercase letter\n- Uppercase letter\n- Number\n- Special character"
      );
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(password, salt);
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (data) {
        console.log(data.user.id);
        const da = data.user.id;
        try {
          const { data: passupdate, error: err } = await supabase
            .from("user_data")
            .update({ hashed_password: hashedpass })
            .eq("id", da)
            .select();
          if (passupdate) {
            console.log("data");
            alert("Successfully updated the change");
            setmail(false);
            settoken(data);
            navigate("/");
          } else {
            //insert new row with a new users uuid into channels_list where all dm contacts data be stored
            console.log("insert id for channel", err);
          }
        } catch (error) {
          console.log(error);
        }
      } else if (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Password Already exists");
    }
  }

  return (
    <div className={newpassCSS.body}>
      <form onSubmit={signup} className={newpassCSS.form}>
        <div className={newpassCSS.head}>
          <h1 className={newpassCSS.h1}>Update your Account</h1>
        </div>
        <div className={newpassCSS.inputout}>
          {passwordVisible ? (
            <span onClick={togglePasswordVisibility}>
              <FaRegEye />
            </span>
          ) : (
            <span onClick={togglePasswordVisibility}>
              <FaEyeSlash />
            </span>
          )}
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            ref={passRef}
            className={newpassCSS.input}
            onChange={(e) => {
              passwordChange(e.target.value);
            }}
          />
        </div>
        <div className={newpassCSS.inputout}>
          {passwordVisible2 ? (
            <span onClick={togglePasswordVisibility2}>
              <FaRegEye />
            </span>
          ) : (
            <span onClick={togglePasswordVisibility2}>
              <FaEyeSlash />
            </span>
          )}
          <input
            type={passwordVisible2 ? "text" : "password"}
            placeholder="Confirm Password"
            className={newpassCSS.input}
            ref={cpassRef}
          />
        </div>
        <button className={newpassCSS.enter} type="submit">
          Update
        </button>
      </form>
    </div>
  );
}
export default Newpass;
