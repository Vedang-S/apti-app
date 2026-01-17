import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [backendData, setBackendData] = useState(null);

  // Listen for auth changes
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  };

  // The crucial backend test function
  const callBackendApi = async () => {
    const token = session?.access_token;
    if (!token) return alert("Log in first!");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      console.error(err);
      alert("API call failed. Check console.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Supabase + Backend Auth Test</h1>

      {!session ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>
            Logged in as: <strong>{session.user.email}</strong>
          </p>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
          <hr />
          <button
            onClick={callBackendApi}
            style={{ background: "#4CAF50", color: "white", padding: "10px" }}
          >
            Test Backend API (GET /api/users/profile)
          </button>

          {backendData && (
            <pre
              style={{ background: "#eee", padding: "10px", marginTop: "10px" }}
            >
              {JSON.stringify(backendData, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
