"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import PuzzleFeed from "./PuzzleFeed";
import PuzzleStats from "./Stats";
import PuzzleDetailModal from "./PuzzleDetailModal";
import PuzzleModal from "./PuzzleModal";

export default function Gallery({ user }) {
  const [puzzles, setPuzzles] = useState([]);
  const [expandedPuzzle, setExpandedPuzzle] = useState(null);
  const [showAddPuzzle, setShowAddPuzzle] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    user: "",
    minPieces: 0,
    maxPieces: Infinity,
    minDifficulty: 0,
    maxDifficulty: 5,
    minEnjoyment: 0,
    maxEnjoyment: 5,
  });

  // Sorting
  const [sortKey, setSortKey] = useState("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const fetchPuzzles = async () => {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPuzzles(data);
  };

  useEffect(() => {
    fetchPuzzles();
  }, []);

  const filteredPuzzles = useMemo(() => {
    let result = [...puzzles];
    result = result.filter((p) => {
      const matchesUser = filters.user ? p.username.includes(filters.user) : true;
      const matchesPieces = p.pieces >= filters.minPieces && p.pieces <= filters.maxPieces;
      const matchesDifficulty =
        p.difficulty >= filters.minDifficulty && p.difficulty <= filters.maxDifficulty;
      const matchesEnjoyment =
        p.enjoyment >= filters.minEnjoyment && p.enjoyment <= filters.maxEnjoyment;
      return matchesUser && matchesPieces && matchesDifficulty && matchesEnjoyment;
    });
    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return result;
  }, [puzzles, filters, sortKey, sortAsc]);

  return (
    <div className="p-4">
      {/* Add Puzzle & Sorting */}
      <div className="flex justify-between mb-4 items-center">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => setShowAddPuzzle(true)}
        >
          Add Puzzle
        </button>

        <div className="flex gap-2 items-center">
          <select
            className="border p-1 rounded"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="created_at">Date</option>
            <option value="pieces">Pieces</option>
            <option value="difficulty">Difficulty</option>
            <option value="enjoyment">Enjoyment</option>
          </select>
          <button
            className="border px-2 rounded"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            {sortAsc ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Filter by user"
          className="border p-1 rounded"
          value={filters.user}
          onChange={(e) => setFilters((f) => ({ ...f, user: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min pieces"
          className="border p-1 rounded"
          onChange={(e) =>
            setFilters((f) => ({ ...f, minPieces: Number(e.target.value) }))
          }
        />
        <input
          type="number"
          placeholder="Max pieces"
          className="border p-1 rounded"
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPieces: Number(e.target.value) || Infinity }))
          }
        />
        <input
          type="number"
          placeholder="Min difficulty"
          className="border p-1 rounded"
          onChange={(e) =>
            setFilters((f) => ({ ...f, minDifficulty: Number(e.target.value) }))
          }
        />
      </div>

      {/* Stats */}
      <PuzzleStats puzzles={filteredPuzzles} />

      {/* Puzzle Gallery */}
      <PuzzleFeed
        puzzles={filteredPuzzles}
        user={user}
        onCardClick={setExpandedPuzzle}
        onEdit={(p) => setEditingPuzzle(p)}
        onDelete={fetchPuzzles}
      />

      {/* Add Puzzle Modal */}
      {showAddPuzzle && (
        <PuzzleModal
          user={user}
          onClose={() => setShowAddPuzzle(false)}
          onSave={fetchPuzzles}
        />
      )}

      {/* Edit Puzzle Modal */}
      {editingPuzzle && (
        <PuzzleModal
          puzzle={editingPuzzle}
          user={user}
          onClose={() => setEditingPuzzle(null)}
          onSave={fetchPuzzles}
        />
      )}

      {/* Expanded Puzzle Modal */}
      {expandedPuzzle && (
        <PuzzleDetailModal
          puzzle={expandedPuzzle}
          user={user}
          onClose={() => setExpandedPuzzle(null)}
        />
      )}
    </div>
  );
}
