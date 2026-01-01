"use client";

import { useState, useEffect } from "react";
import Gallery from "./components/Gallery"; // components inside app/
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [puzzles, setPuzzles] = useState([]);
  const [user, setUser] = useState(null);

  // --- Get current logged-in user
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) setUser(data.session.user);
    };
    getSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(puzzleChannel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Gallery puzzles={puzzles} user={user} />
    </main>
  );
}
