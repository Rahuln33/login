import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>{" "}
          {/* Link to AdminPage */}
        </ul>
      </nav>
    </div>
  );
};

export default Home;
