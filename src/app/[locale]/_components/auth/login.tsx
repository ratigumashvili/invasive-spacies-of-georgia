"use client"

import { loginUser } from "@/lib/api-calls";
import { useState } from "react";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleLogin = async () => {
    const data = await loginUser(identifier, password);
    console.log("Login Response:", data);
    if (data.status === "success") {
      setLoginMessage("Login successful!");
      // Store the JWT token (data.data.jwt) in local storage or a cookie
      // Redirect the user to a protected area
    } else {
      setLoginMessage(data.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {loginMessage && <p>{loginMessage}</p>}
    </div>
  );
}