"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <Auth />;

  return <PuzzleFeed user={user} />;
}

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    await supabase.auth.signInWithPassword({ email, password });
    location.reload();
  }

  async function signUp() {
    await supabase.auth.signUp({ email, password });
    alert("Check your email!");
  }

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧩 Puzzle Tracker</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 mr-2" onClick={signIn}>Sign In</button>
      <button className="border px-4 py-2" onClick={signUp}>Sign Up</button>
    </div>
  );
}

function PuzzleFeed({ user }) {
  const [puzzles, setPuzzles] = useState([]);
  const [form, setForm] = useState({ title: "", pieces: "", difficulty: 3, enjoyment: 3 });

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });

    setPuzzles(data || []);
  }

  async function submitPuzzle(e) {
    e.preventDefault();

    await supabase.from("puzzles").insert({
      user_id: user.id,
      username: user.email,
      ...form,
    });

    setForm({ title: "", pieces: "", difficulty: 3, enjoyment: 3 });
    loadPuzzles();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Log a Puzzle</h2>

      <form onSubmit={submitPuzzle} className="space-y-2">
        <input className="border p-2 w-full" placeholder="Puzzle name" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <input type="number" className="border p-2 w-full" placeholder="Pieces" value={form.pieces} onChange={e => setForm({...form, pieces: e.target.value})} />
        <button className="bg-black text-white px-4 py-2">Add</button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-2">Completed Puzzles</h2>

      {puzzles.map(p => (
        <div key={p.id} className="border rounded p-3 mb-2">
          <strong>{p.title}</strong> ({p.pieces} pieces)
          <div className="text-sm text-gray-500">by {p.username}</div>
        </div>
      ))}
    </div>
  );
}
