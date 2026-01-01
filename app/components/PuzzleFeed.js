"use client";

export default function PuzzleFeed({ puzzles, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {puzzles.map((puzzle) => (
        <div
          key={puzzle.id}
          className="border rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
        >
          {puzzle.image_url && (
            <img
              src={puzzle.image_url}
              alt={puzzle.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-3">
            <h3 className="font-bold text-lg">{puzzle.title}</h3>
            <p>Pieces: {puzzle.pieces}</p>
            <p>Difficulty: {puzzle.difficulty}/5</p>
            <p>Enjoyment: {puzzle.enjoyment}/5</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => onEdit(puzzle)}
                className="border px-3 py-1 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(puzzle.id)}
                className="border px-3 py-1 rounded-lg text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
