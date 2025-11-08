import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import GlassMessage from "../../components/GlassMessage";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./index.css";

export default function Login() {
  const [currentUser, setCurrentUser] = useState("candidate");

  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();

  const loginSuccess = (token) => {
    setMessage("Login successful! 🎉"); // show message
    Cookies.set("jwt_token", token, { expires: 30 });

    // wait 3 seconds before redirect
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    setTimeout(() => {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/candidate");
      }
    }, 3000);
  };

  const loginFailure = (error) => {
    setError(error);
    setMessage("Login failed ❌");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password,currentUser);
      const data = await res.json();
      if (res.ok) {
        loginSuccess(data.token);
      } else {
        loginFailure(data.msg);
      }
    } catch (error) {
      console.log("login error ", error);
    }
  };

  const onClickRegister = () => {
    navigate("/register", { replace: true });
  };

  return (
    <div className="login-container">
      <div>
        <GlassMessage message={message} />
      </div>
      <div className="login-card-container">
        <h1>Login</h1>

        <div className="role-toggle">
          <p
            className={currentUser === "candidate" ? "active-role" : ""}
            onClick={() => setCurrentUser("candidate")}
          >
            Candidate
          </p>
          <p
            className={currentUser === "admin" ? "active-role" : ""}
            onClick={() => setCurrentUser("admin")}
          >
            Admin
          </p>
        </div>

        <form className="login-card-container-form" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div className="role-toggle">
            <select
              className="role-select"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
            >
              <option value="candidate">Candidate</option>
              <option value="admin">Admin</option>
            </select>

            
            <div
              className={`underline ${
                currentUser === "admin" ? "move-right" : "move-left"
              }`}
            ></div>
          </div> */}

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>

          <p>
            Don’t have an account?{" "}
            <span onClick={onClickRegister}>click here</span>
          </p>

          {errorMsg && <p>{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
