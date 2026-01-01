"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "./components/AuthForm";
import PuzzleForm from "./components/PuzzleForm";
import PuzzleFeed from "./components/PuzzleFeed";
import Stats from "./components/Stats";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <AuthForm />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧩 Jigsaw Puzzle Tracker</h1>
      <Stats user={user} />
      <PuzzleForm user={user} />
      <PuzzleFeed />
    </div>
  );
}
