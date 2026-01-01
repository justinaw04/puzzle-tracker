"use client";

import { supabase } from "../../lib/supabase";

export default function PuzzleFeed({ puzzles, user, onCardClick, onEdit, onDelete }) {
  const handleDelete = async (puzzle) => {
    if (!confirm("Delete this puzzle?")) return;
    await supabase.from("puzzles").delete().eq("id", puzzle.id);
    onDelete(); // refresh puzzles
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {puzzles.map((puzzle) => (
        <div
          key={puzzle.id}
          className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition relative"
          onClick={() => onCardClick(puzzle)}
        >
          <img
            src={puzzle.image_url}
            alt={puzzle.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-3">
            <h3 className="font-bold text-lg truncate">{puzzle.title}</h3>
            <p className="text-sm">Pieces: {puzzle.pieces}</p>
            <p className="text-sm">Difficulty: {puzzle.difficulty}</p>
            <p className="text-sm">Enjoyment: {puzzle.enjoyment}</p>
            <p className="text-sm text-gray-500 truncate">By: {puzzle.username}</p>

            {user?.id === puzzle.user_id && (
              <div className="mt-2 flex gap-2">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(puzzle);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(puzzle);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
