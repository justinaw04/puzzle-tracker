"use client";

import { useState, useEffect } from "react";
import Gallery from "./components/Gallery"; // components inside app/
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [puzzles, setPuzzles] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Get current logged-in user
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) setUser(data.session.user);
    };
    getSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // --- Fetch puzzles
  useEffect(() => {
    const fetchPuzzles = async () => {
      const { data, error } = await supabase
        .from("puzzles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPuzzles(data);
    };
    fetchPuzzles();

    // --- Real-time subscription using v2 API
    const puzzleChannel = supabase
      .channel("public:puzzles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "puzzles" },
        (payload) => {
          setPuzzles((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new, ...prev];
              case "UPDATE":
                return prev.map((p) =>
                  p.id === payload.new.id ? payload.new : p
                );
              case "DELETE":
                return prev.filter((p) => p.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(puzzleChannel);
  }, []);

  // --- Auth handlers
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
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

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="p-4 flex justify-between items-center border-b mb-4">
        <h1 className="text-2xl font-bold">Jigsaw Tracker</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">Logged in as: {user.email}</p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={handleLogin}
              disabled={loading}
            >
              Log In
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSignup}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {user ? (
        <Gallery puzzles={puzzles} user={user} />
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Please log in or sign up to track puzzles.
        </p>
      )}
    </main>
  );
}
