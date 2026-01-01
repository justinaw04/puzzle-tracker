"use client";

import { useState, useEffect } from "react";
import Gallery from "../components/Gallery";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [puzzles, setPuzzles] = useState([]);
  const [user, setUser] = useState(null);

  // --- Get current logged-in user
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getSession();

    // Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- Fetch all puzzles
  useEffect(() => {
    const fetchPuzzles = async () => {
      const { data, error } = await supabase
        .from("puzzles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPuzzles(data);
    };
    fetchPuzzles();

    // --- Real-time updates
    const subscription = supabase
      .from("puzzles")
      .on("*", (payload) => {
        // payload.eventType can be INSERT, UPDATE, DELETE
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
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Gallery puzzles={puzzles} user={user} />
    </main>
  );
}
