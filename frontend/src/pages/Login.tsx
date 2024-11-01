import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface LoginUserDto {
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendStatus, setBackendStatus] = useState<"ready" | "not ready">(
    "not ready"
  );
  const navigate = useNavigate();

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/?timestamp=${new Date().getTime()}`,
        { method: "GET", cache: "no-store" }
      );
      setBackendStatus(response.ok ? "ready" : "not ready");
    } catch (error) {
      console.error("Error checking backend status:", error);
      setBackendStatus("not ready");
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const intervalId = setInterval(checkBackendStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // may cause throttling
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) navigate("/dashboard");
  // }, [navigate]);

  const mutation = useMutation({
    mutationFn: async (userData: LoginUserDto) => {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error logging in");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
    },

    onSuccess: () => {
      navigate("/dashboard");
    },

    onError: (error: any) => {
      console.error("Error logging in:", error.message);
      alert(`Login failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="password"
          />
          <button type="submit">Log In</button>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>

        <div className="backend-status">
          <span
            className="status-indicator"
            style={{
              backgroundColor: backendStatus === "ready" ? "green" : "red",
            }}
          ></span>
          <span>
            {backendStatus === "ready" ? "Backend ready" : "Backend not ready"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
