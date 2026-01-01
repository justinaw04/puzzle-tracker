"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
    };
    getSession();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, [setUser]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setUser(data.user);
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert("Check your email to confirm signup!");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">Logged in as: {session.user.email}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <div className="flex gap-2">
        <button
          className="bg-black text-white px-4 py-2 rounded flex-1"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          onClick={handleSignup}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
