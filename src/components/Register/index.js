import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import styles from "./register.module.css";
import logo from "./img/logo-fitness-fog.png";
import { FaUser, FaLock } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  // const [errorObj, setErrorObj] = useState({});
  const cookies = new Cookies();

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/user/createUser",
        {
          username: username,
          email: email,
          pass: pass,
          confirmPass: confirmPass,
        }
      );
      if (response) {
        cookies.set("refreshToken", response.data.refreshToken.key , {path:"/", expires:new Date(Date.now()+response.data.refreshToken.exp)})
        cookies.set("user", username , {path:"/", expires:new Date(Date.now()+response.data.refreshToken.exp)})
        Swal.fire({
          title: `${response.data.msg}!`,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            return window.location.assign("./add-profile");
          }
        });
      }
    } catch (err) {
      if (err.response.status === 400) {
        Swal.fire({
          title: `Bad Request!`,
          text: `${err.response.data.msg}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className={styles["Register"]}>
      <div className={styles["img-bg"]}></div>
      <div className={styles["opa"]}></div>

      <header className={styles["register-logo-header"]}>
        <Link to={"../"} style={{ textDecoration: "none" }}>
          <img src={logo} width="63px" alt="fitness-frog logo" />
        </Link>
        <Link to={"../"} style={{ textDecoration: "none" }}>
          <h3>Fitness Frog</h3>
        </Link>
      </header>

      <main className={styles["register-container"]}>
        <section className={styles["register-title"]}>
          <h1 className="text-dark">Register</h1>
        </section>
        <form className={styles["register-Form"]} onSubmit={register}>
          <div className={styles["form-group"]}>
            <HiOutlineMail
              className={styles["iconShow"]}
              style={{ fontSize: "2.2rem", color: "#ffffffd9" }}
            />
            <input
              type="email"
              name="email-register"
              id="email-register-id"
              placeholder="E-mail"
              autoComplete="off"
              value={email}
              onChange={({ target }) => {
                return setEmail(target.value);
              }}
            />
          </div>

          <div className={styles["form-group"]}>
            <FaUser
              className={styles["iconShow"]}
              style={{ fontSize: "2rem", color: "#ffffffd9" }}
            />
            <input
              type="text"
              name="username-register"
              id="username-register-id"
              placeholder="Username"
              autoComplete="off"
              value={username}
              onChange={({ target }) => {
                return setUsername(target.value);
              }}
            />
          </div>

          <div className={styles["form-group"]}>
            <FaLock
              className={styles["iconShow"]}
              style={{ fontSize: "2rem", color: "#ffffffd9" }}
            />
            <input
              type="password"
              name="password-register"
              id="password-register-id"
              placeholder="Password"
              autoComplete="off"
              value={pass}
              onChange={({ target }) => {
                return setPass(target.value);
              }}
            />
          </div>

          <div className={styles["form-group"]}>
            <FaLock
              className={styles["iconShow"]}
              style={{ fontSize: "2rem", color: "#ffffffd9" }}
            />
            <input
              type="password"
              name="confirm-password-register"
              id="confirm-password-register-id"
              placeholder="Confirm Password"
              autoComplete="off"
              value={confirmPass}
              onChange={({ target }) => {
                return setConfirmPass(target.value);
              }}
            />
          </div>
          <section className={styles["register-button"]}>
            <button type="submit" id={styles["btn-register-id"]}>
              Register
            </button>
          </section>
        </form>
      </main>
    </div>
  );
};

export default Register;
