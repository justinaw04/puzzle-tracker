"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "./components/AuthForm";
import PuzzleFeed from "./components/PuzzleFeed";
import PuzzleModal from "./components/PuzzleModal";
import Stats from "./components/Stats";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <AuthForm />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧩 Puzzle Tracker</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          ➕ Add Puzzle
        </button>
      </header>

      <Stats />

      <PuzzleFeed user={user} />

      {showModal && (
        <PuzzleModal
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
