"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PuzzleModal({ user, puzzle, onClose, onSave }) {
  const [title, setTitle] = useState(puzzle?.title || "");
  const [pieces, setPieces] = useState(puzzle?.pieces || "");
  const [difficulty, setDifficulty] = useState(puzzle?.difficulty || 3);
  const [enjoyment, setEnjoyment] = useState(puzzle?.enjoyment || 3);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = puzzle?.image_url || null;

      // 1️⃣ Upload image if selected
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = fileName; // store in root of bucket

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from("puzzle-images")
          .upload(filePath, image, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("puzzle-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // 2️⃣ Insert or update puzzle
      if (puzzle) {
        // Editing existing puzzle
        const { error: updateError } = await supabase
          .from("puzzles")
          .update({
            title,
            pieces: Number(pieces),
            difficulty,
            enjoyment,
            image_url: imageUrl,
          })
          .eq("id", puzzle.id);

        if (updateError) throw updateError;
      } else {
        // Adding new puzzle
        const { error: insertError } = await supabase
          .from("puzzles")
          .insert({
            user_id: user.id,
            username: user.email,
            title,
            pieces: Number(pieces),
            difficulty,
            enjoyment,
            image_url: imageUrl,
          });

        if (insertError) throw insertError;
      }

      // 3️⃣ Close modal and refresh feed
      onClose();
      onSave(); // this should refetch puzzles and update stats

    } catch (err) {
      console.error("Error saving puzzle:", err.message);
      alert("Error saving puzzle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3"
      >
        <h2 className="text-xl font-bold">
          {puzzle ? "Edit Puzzle" : "Add New Puzzle"}
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Puzzle Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Pieces"
          value={pieces}
          onChange={(e) => setPieces(e.target.value)}
          required
        />

        <label>Difficulty {"⭐".repeat(difficulty)}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={difficulty}
          onChange={(e) => setDifficulty(+e.target.value)}
        />

        <label>Enjoyment {"❤️".repeat(enjoyment)}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={enjoyment}
          onChange={(e) => setEnjoyment(+e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
