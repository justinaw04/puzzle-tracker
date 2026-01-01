"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PuzzleModal({ user, puzzle, onClose, onSave }) {
  const [title, setTitle] = useState(puzzle?.title || "");
  const [pieces, setPieces] = useState(puzzle?.pieces || 0);
  const [difficulty, setDifficulty] = useState(puzzle?.difficulty || 3);
  const [enjoyment, setEnjoyment] = useState(puzzle?.enjoyment || 3);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("You must be logged in to submit a puzzle!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = puzzle?.image_url || null;

      // Upload image if selected
      if (image) {
        const fileExt = image.name.split(".").pop();
        const safeUserId = user.id.replace(/[^a-zA-Z0-9-]/g, "");
        const fileName = `${safeUserId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("puzzle-images")
          .upload(fileName, image, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
          .from("puzzle-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Insert or update puzzle
      if (puzzle) {
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

      onClose();
      onSave(); // refresh feed/stats

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

        <label>Difficulty (0-5)</label>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={difficulty}
          onChange={(e) => setDifficulty(+e.target.value)}
        />

        <label>Enjoyment (0-5)</label>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
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
