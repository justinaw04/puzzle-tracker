"use client";

export default function PuzzleFeed({ puzzles, user, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {puzzles.map((puzzle) => (
        <div
          key={puzzle.id}
          className="bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden flex flex-col"
        >
          {puzzle.image_url && (
            <img
              src={puzzle.image_url}
              alt={puzzle.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg">{puzzle.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By: {puzzle.username}</p>
              <p>Pieces: {puzzle.pieces}</p>
              <p>Difficulty: {puzzle.difficulty}/5</p>
              <p>Enjoyment: {puzzle.enjoyment}/5</p>
            </div>

            {user?.id === puzzle.user_id && (
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onEdit(puzzle)}
                  className="border px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(puzzle.id)}
                  className="border px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 transition"
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
