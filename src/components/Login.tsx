import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa"; // Icon import for Lock (Bootstrap has no built-in lock icon)

const Login = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Register Number:", registerNumber);
    console.log("Password:", password);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <div
              className="avatar"
              style={{
                backgroundColor: "#1976d2",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <FaLock color="#fff" size={30} />
            </div>
            <h5 className="mt-3">Login</h5>
          </div>

          <form>
            <div className="mb-3">
              <label htmlFor="registerNumber" className="form-label">
                Register Number
              </label>
              <input
                type="text"
                className="form-control"
                id="registerNumber"
                name="registerNumber"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleLogin}
            >
              Login
            </button>

            <div className="mt-3 text-center">
              <Link to="/register" className="text-decoration-none">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
