import { useEffect, useState } from "react";
import UserManager from "../services/UserManager";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/TokenManager";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (TokenManager.getClaims()) {
      navigate("/");
      window.location.reload();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

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
    <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col">
      <h3>Login</h3>

      <label htmlFor="emailAddress" className="block">
        E-mailadres
        <input
          type="text"
          className="mb-3 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="E-mailadres"
          required
          id="emailAddress"
        />
      </label>
      <label htmlFor="password" className="block">
        Wachtwoord
        <input
          type="password"
          className="mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wachtwoord"
          required
          id="password"
        />
      </label>
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
