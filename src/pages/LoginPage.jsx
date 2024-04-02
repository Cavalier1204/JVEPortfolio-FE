import { useState } from "react";
import UserManager from "../services/UserManager";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(username, password);
    UserManager.signin(username, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 401) {
          alert("Your credentials are incorrect!");
        } else {
          alert("An error occurred!");
        }
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>

      <div className="form-floating">
        <input
          type="text"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          id="floatingUsername"
        />
        <label htmlFor="floatingUsername">Username</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          id="floatingPassword"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md"
      >
        Login
      </button>
    </form>
  );
};

export default LoginPage;
