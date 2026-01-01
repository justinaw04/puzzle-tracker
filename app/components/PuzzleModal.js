"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase"; // adjust path if needed

export default function PuzzleModal({ user, puzzle = null, onClose, onSave }) {
  const [title, setTitle] = useState(puzzle?.title || "");
  const [pieces, setPieces] = useState(puzzle?.pieces || 0);
  const [difficulty, setDifficulty] = useState(puzzle?.difficulty || 0);
  const [enjoyment, setEnjoyment] = useState(puzzle?.enjoyment || 0);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to add a puzzle.");
      return;
    }
    if (!title || !pieces || !difficulty || !enjoyment) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = puzzle?.image_url || "";

      // Upload new image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from("puzzle-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("puzzle-images")
          .getPublicUrl(fileName);
        imageUrl = publicData.publicUrl;
      }

      // Insert or update puzzle in Supabase
      if (puzzle) {
        // Update existing puzzle
        const { error: updateError } = await supabase
          .from("puzzles")
          .update({
            title,
            pieces,
            difficulty,
            enjoyment,
            image_url: imageUrl,
          })
          .eq("id", puzzle.id);
        if (updateError) throw updateError;
      } else {
        // Insert new puzzle
        const { error: insertError } = await supabase.from("puzzles").insert({
          title,
          pieces,
          difficulty,
          enjoyment,
          image_url: imageUrl,
          user_id: user.id,
          username: user.email, // or full name if stored
        });
        if (insertError) throw insertError;
      }

      onSave?.(); // optional callback to refresh puzzle list
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error saving puzzle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">
          {puzzle ? "Edit Puzzle" : "Add Puzzle"}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded w-full mb-2"
          placeholder="Pieces"
          value={pieces}
          onChange={(e) => setPieces(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-2 rounded w-full mb-2"
          placeholder="Difficulty (0-5)"
          value={difficulty}
          min={0}
          max={5}
          onChange={(e) => setDifficulty(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-2 rounded w-full mb-2"
          placeholder="Enjoyment (0-5)"
          value={enjoyment}
          min={0}
          max={5}
          onChange={(e) => setEnjoyment(Number(e.target.value))}
        />
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded w-full mb-4"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : puzzle ? "Update Puzzle" : "Add Puzzle"}
        </button>
      </div>
    </div>
  );
}
