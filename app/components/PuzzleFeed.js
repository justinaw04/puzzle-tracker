"use client";

import { useState, useMemo } from "react";

export default function PuzzleFeed({ puzzles, onEdit, onDelete }) {
  // --- Filter states
  const [userFilter, setUserFilter] = useState("");
  const [minPieces, setMinPieces] = useState("");
  const [maxPieces, setMaxPieces] = useState("");
  const [minDifficulty, setMinDifficulty] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");
  const [minEnjoyment, setMinEnjoyment] = useState("");
  const [maxEnjoyment, setMaxEnjoyment] = useState("");

  // --- Sort state
  const [sortBy, setSortBy] = useState("date_desc"); // default newest first

  // --- Unique users for filter dropdown
  const users = [...new Set(puzzles.map(p => p.username))];

  // --- Filtered + sorted puzzles
  const filteredPuzzles = useMemo(() => {
    let result = [...puzzles];

    // Filters
    if (userFilter) result = result.filter(p => p.username === userFilter);
    if (minPieces) result = result.filter(p => p.pieces >= +minPieces);
    if (maxPieces) result = result.filter(p => p.pieces <= +maxPieces);
    if (minDifficulty) result = result.filter(p => p.difficulty >= +minDifficulty);
    if (maxDifficulty) result = result.filter(p => p.difficulty <= +maxDifficulty);
    if (minEnjoyment) result = result.filter(p => p.enjoyment >= +minEnjoyment);
    if (maxEnjoyment) result = result.filter(p => p.enjoyment <= +maxEnjoyment);

    // Sort
    switch (sortBy) {
      case "date_asc":
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "date_desc":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "pieces_asc":
        result.sort((a, b) => a.pieces - b.pieces);
        break;
      case "pieces_desc":
        result.sort((a, b) => b.pieces - a.pieces);
        break;
      case "difficulty_asc":
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case "difficulty_desc":
        result.sort((a, b) => b.difficulty - a.difficulty);
        break;
      case "enjoyment_asc":
        result.sort((a, b) => a.enjoyment - b.enjoyment);
        break;
      case "enjoyment_desc":
        result.sort((a, b) => b.enjoyment - a.enjoyment);
        break;
      default:
        break;
    }

    return result;
  }, [
    puzzles,
    userFilter,
    minPieces,
    maxPieces,
    minDifficulty,
    maxDifficulty,
    minEnjoyment,
    maxEnjoyment,
    sortBy
  ]);

  return (
    <div className="p-4">
      {/* --- Filters / Sorters */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        {/* User filter */}
        <div>
          <label className="block text-sm">User</label>
          <select
            className="border p-1 rounded"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All</option>
            {users.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Pieces filter */}
        <div>
          <label className="block text-sm">Pieces Min</label>
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={minPieces}
            onChange={(e) => setMinPieces(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Pieces Max</label>
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={maxPieces}
            onChange={(e) => setMaxPieces(e.target.value)}
          />
        </div>

        {/* Difficulty filter */}
        <div>
          <label className="block text-sm">Difficulty Min</label>
          <input
            type="number"
            min="0" max="5"
            className="border p-1 rounded w-20"
            value={minDifficulty}
            onChange={(e) => setMinDifficulty(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Difficulty Max</label>
          <input
            type="number"
            min="0" max="5"
            className="border p-1 rounded w-20"
            value={maxDifficulty}
            onChange={(e) => setMaxDifficulty(e.target.value)}
          />
        </div>

        {/* Enjoyment filter */}
        <div>
          <label className="block text-sm">Enjoyment Min</label>
          <input
            type="number"
            min="0" max="5"
            className="border p-1 rounded w-20"
            value={minEnjoyment}
            onChange={(e) => setMinEnjoyment(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Enjoyment Max</label>
          <input
            type="number"
            min="0" max="5"
            className="border p-1 rounded w-20"
            value={maxEnjoyment}
            onChange={(e) => setMaxEnjoyment(e.target.value)}
          />
        </div>

        {/* Sorter */}
        <div>
          <label className="block text-sm">Sort By</label>
          <select
            className="border p-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="pieces_desc">Pieces ↓</option>
            <option value="pieces_asc">Pieces ↑</option>
            <option value="difficulty_desc">Difficulty ↓</option>
            <option value="difficulty_asc">Difficulty ↑</option>
            <option value="enjoyment_desc">Enjoyment ↓</option>
            <option value="enjoyment_asc">Enjoyment ↑</option>
          </select>
        </div>
      </div>

      {/* --- Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPuzzles.map((puzzle) => (
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
              <p className="text-sm text-gray-500">By: {puzzle.username}</p>
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
    </div>
  );
}
