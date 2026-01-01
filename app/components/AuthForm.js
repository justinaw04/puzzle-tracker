"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    await supabase.auth.signInWithPassword({ email, password });
    location.reload();
  }

  async function signUp() {
    await supabase.auth.signUp({ email, password });
    alert("Check your email to confirm!");
  }

  return (
    <div className="max-w-sm mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">🧩 Puzzle Tracker</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={signIn} className="bg-black text-white px-4 py-2 mr-2">Sign In</button>
      <button onClick={signUp} className="border px-4 py-2">Sign Up</button>
    </div>
  );
}
