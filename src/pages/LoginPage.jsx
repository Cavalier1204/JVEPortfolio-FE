import { useEffect, useState } from "react";
import UserManager from "../services/UserManager";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/TokenManager";
import { useAuth } from "../modules/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { login } = useAuth();

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
      .then((token) => {
        login(token);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        if (error.response && error.response.status === 401) {
          setLoginError("Gebruikersnaam en/of wachtwoord incorrect.");
          setPassword("");
          document.getElementById("emailAddress").focus();
        } else {
          setLoginError("Er is iets fout gegaan, probeer het later opnieuw.");
        }
      });
  };

  return (
    <div className="md:container md:mx-auto flex justify-center pt-5">
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
            data-testid="usernameInput"
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
            data-testid="passwordInput"
          />
        </label>
        {loginError && (
          <p
            data-testid="loginError"
            className="text-red-600 font-medium mb-3 text-center"
          >
            {loginError}
          </p>
        )}

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
            data-testid="loginButton"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
