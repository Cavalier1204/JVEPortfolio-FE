import { useEffect, useState } from "react";
import UserManager from "../services/UserManager";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/TokenManager";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (TokenManager.getClaims()) {
      navigate("/");
      window.location.reload();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    UserManager.signin(username, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        if (error.response && error.response.status === 401) {
          alert("Gebruikersnaam en/of wachtwoord incorrect.");
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
      {isLoading ? (
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md flex justify-center cursor-not-allowed"
          disabled
        >
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Laden...
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-700 shadow-md"
          type="submit"
        >
          Login
        </button>
      )}
    </form>
  );
};

export default LoginPage;
