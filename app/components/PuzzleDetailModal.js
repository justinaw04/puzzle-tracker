"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PuzzleDetailModal({ puzzle, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!puzzle) return;

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("puzzle_comments")
        .select("*")
        .eq("puzzle_id", puzzle.id)
        .order("created_at", { ascending: true });

      if (!error) setComments(data);
    };

    fetchComments();
  }, [puzzle]);

  const handleCommentSubmit = async () => {
    if (!user || !newComment.trim()) return;

    const { data, error } = await supabase
      .from("puzzle_comments")
      .insert([
        {
          puzzle_id: puzzle.id,
          user_id: user.id,
          username: user.email, // or user.metadata.full_name if you store that
          content: newComment,
        },
      ])
      .select()
      .single();

    if (!error) {
      setComments((prev) => [...prev, data]);
      setNewComment("");
    }
  };

  if (!puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={puzzle.image_url}
          alt={puzzle.title}
          className="w-full rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{puzzle.title}</h2>
        <p>Pieces: {puzzle.pieces}</p>
        <p>Difficulty: {puzzle.difficulty}</p>
        <p>Enjoyment: {puzzle.enjoyment}</p>
        <p>By: {puzzle.username}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Comments</h3>
          <div className="max-h-64 overflow-y-auto space-y-2 mb-2">
            {comments.map((c) => (
              <div key={c.id} className="border rounded p-2 bg-gray-50">
                <span className="font-semibold">{c.username}</span>: {c.content}
              </div>
            ))}
          </div>

          {user && (
            <div className="flex gap-2">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="bg-black text-white px-4 rounded"
                onClick={handleCommentSubmit}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
