"use client";

export default function PuzzleFeed({ puzzles, user, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {puzzles.map((puzzle) => (
        <div
          key={puzzle.id}
          className="bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
          onClick={() => onCardClick(puzzle)}
        >
          <img
            src={puzzle.image_url}
            alt={puzzle.title}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h3 className="font-bold text-lg">{puzzle.title}</h3>
          <p className="text-sm">Pieces: {puzzle.pieces}</p>
          <p className="text-sm">Difficulty: {puzzle.difficulty}</p>
          <p className="text-sm">Enjoyment: {puzzle.enjoyment}</p>
          <p className="text-sm text-gray-500">By: {puzzle.username}</p>

          {/* Edit/Delete buttons only for the owner */}
          {user?.id === puzzle.user_id && (
            <div className="mt-2 flex gap-2">
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
