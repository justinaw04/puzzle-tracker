"use client";

import { useState, useMemo } from "react";
import PuzzleFeed from "./PuzzleFeed";
import PuzzleStats from "./Stats";
import PuzzleDetailModal from "./PuzzleDetailModal";

export default function Gallery({ puzzles, user }) {
  const [expandedPuzzle, setExpandedPuzzle] = useState(null);
  const [filters, setFilters] = useState({
    user: "",
    minPieces: 0,
    maxPieces: Infinity,
    minDifficulty: 0,
    maxDifficulty: 5,
    minEnjoyment: 0,
    maxEnjoyment: 5,
  });
  const [sortKey, setSortKey] = useState("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  // --- Filtered + sorted puzzles
  const filteredPuzzles = useMemo(() => {
    let result = [...puzzles];

    // Filters
    result = result.filter((p) => {
      const matchesUser = filters.user ? p.username === filters.user : true;
      const matchesPieces =
        p.pieces >= filters.minPieces && p.pieces <= filters.maxPieces;
      const matchesDifficulty =
        p.difficulty >= filters.minDifficulty &&
        p.difficulty <= filters.maxDifficulty;
      const matchesEnjoyment =
        p.enjoyment >= filters.minEnjoyment &&
        p.enjoyment <= filters.maxEnjoyment;
      return matchesUser && matchesPieces && matchesDifficulty && matchesEnjoyment;
    });

    // Sort
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
      {/* Stats */}
      <PuzzleStats puzzles={filteredPuzzles} />

      {/* Puzzle Feed */}
      <PuzzleFeed
        puzzles={filteredPuzzles}
        user={user}
        onCardClick={setExpandedPuzzle}
      />

      {/* Expanded Modal */}
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
