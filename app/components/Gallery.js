"use client";

import { useState, useMemo } from "react";
import PuzzleFeed from "./PuzzleFeed";
import PuzzleStats from "./PuzzleStats";
import PuzzleModal from "./PuzzleModal";

export default function Gallery({ puzzles, user }) {
  const [userFilter, setUserFilter] = useState("");
  const [minPieces, setMinPieces] = useState("");
  const [maxPieces, setMaxPieces] = useState("");
  const [minDifficulty, setMinDifficulty] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");
  const [minEnjoyment, setMinEnjoyment] = useState("");
  const [maxEnjoyment, setMaxEnjoyment] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);

  // --- Unique users for dropdown
  const users = [...new Set(puzzles.map(p => p.username))];

  // --- Filter & sort logic
  const filteredPuzzles = useMemo(() => {
    let result = [...puzzles];

    if (userFilter) result = result.filter(p => p.username === userFilter);
    if (minPieces) result = result.filter(p => p.pieces >= +minPieces);
    if (maxPieces) result = result.filter(p => p.pieces <= +maxPieces);
    if (minDifficulty) result = result.filter(p => p.difficulty >= +minDifficulty);
    if (maxDifficulty) result = result.filter(p => p.difficulty <= +maxDifficulty);
    if (minEnjoyment) result = result.filter(p => p.enjoyment >= +minEnjoyment);
    if (maxEnjoyment) result = result.filter(p => p.enjoyment <= +maxEnjoyment);

    switch (sortBy) {
      case "date_asc": result.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)); break;
      case "date_desc": result.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)); break;
      case "pieces_asc": result.sort((a,b)=>a.pieces-b.pieces); break;
      case "pieces_desc": result.sort((a,b)=>b.pieces-a.pieces); break;
      case "difficulty_asc": result.sort((a,b)=>a.difficulty-b.difficulty); break;
      case "difficulty_desc": result.sort((a,b)=>b.difficulty-a.difficulty); break;
      case "enjoyment_asc": result.sort((a,b)=>a.enjoyment-b.enjoyment); break;
      case "enjoyment_desc": result.sort((a,b)=>b.enjoyment-a.enjoyment); break;
      default: result.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    }

    return result;
  }, [puzzles, userFilter, minPieces, maxPieces, minDifficulty, maxDifficulty, minEnjoyment, maxEnjoyment, sortBy]);

  // --- Handlers
  const handleEdit = (puzzle) => {
    setEditingPuzzle(puzzle);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPuzzle(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    // call your delete function and refresh state
    console.log("Delete puzzle", id);
  };

  return (
    <div className="p-4 space-y-6">
      {/* --- Add Puzzle Button */}
      <div className="flex justify-end">
        <button
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          onClick={handleAdd}
        >
          Add New Puzzle
        </button>
      </div>

      {/* --- Filters and Sorters */}
      <div className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-2xl shadow">
        {/* User */}
        <div>
          <label className="block text-sm font-medium">User</label>
          <select
            className="border p-1 rounded"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Pieces */}
        <div>
          <label className="block text-sm font-medium">Pieces Min</label>
          <input
            type="number" className="border p-1 rounded w-20"
            value={minPieces} onChange={e => setMinPieces(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pieces Max</label>
          <input
            type="number" className="border p-1 rounded w-20"
            value={maxPieces} onChange={e => setMaxPieces(e.target.value)}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium">Difficulty Min</label>
          <input type="number" min="0" max="5" className="border p-1 rounded w-20"
            value={minDifficulty} onChange={e => setMinDifficulty(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Difficulty Max</label>
          <input type="number" min="0" max="5" className="border p-1 rounded w-20"
            value={maxDifficulty} onChange={e => setMaxDifficulty(e.target.value)}
          />
        </div>

        {/* Enjoyment */}
        <div>
          <label className="block text-sm font-medium">Enjoyment Min</label>
          <input type="number" min="0" max="5" className="border p-1 rounded w-20"
            value={minEnjoyment} onChange={e => setMinEnjoyment(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Enjoyment Max</label>
          <input type="number" min="0" max="5" className="border p-1 rounded w-20"
            value={maxEnjoyment} onChange={e => setMaxEnjoyment(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium">Sort By</label>
          <select
            className="border p-1 rounded"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
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

      {/* --- Stats */}
      <PuzzleStats puzzles={filteredPuzzles} />

      {/* --- Gallery */}
      <PuzzleFeed
        puzzles={filteredPuzzles}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* --- Modal */}
      {modalOpen && (
        <PuzzleModal
          user={user}
          puzzle={editingPuzzle}
          onClose={() => setModalOpen(false)}
          onSave={() => setModalOpen(false)} // refresh puzzles externally
        />
      )}
    </div>
  );
}
