"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PuzzleDetailModal({ puzzle, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
      .insert({
        puzzle_id: puzzle.id,
        user_id: user.id,
        username: user.email,
        content: newComment,
      })
      .select()
      .single();
    if (!error) setComments((prev) => [...prev, data]);
    setNewComment("");
  };

  if (!puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1 flex flex-col gap-4">
          <img
            src={puzzle.image_url}
            alt={puzzle.title}
            className="w-full h-auto rounded-xl object-contain"
          />

          <div>
            <h2 className="text-xl font-bold mb-2">{puzzle.title}</h2>
            <p>Pieces: {puzzle.pieces}</p>
            <p>Difficulty: {puzzle.difficulty}</p>
            <p>Enjoyment: {puzzle.enjoyment}</p>
            <p>By: {puzzle.username}</p>
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold mb-2">Comments</h3>

            <div className="flex-1 overflow-y-auto space-y-2 mb-2 max-h-64">
              {comments.map((c) => (
                <div key={c.id} className="border rounded p-2 bg-gray-50">
                  <span className="font-semibold">{c.username}</span>: {c.content}
                </div>
              ))}
            </div>

            {user && (
              <div className="flex gap-2 mt-auto">
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
    </div>
  );
}
