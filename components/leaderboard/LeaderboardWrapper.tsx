'use client';

import React, { useState, useMemo } from 'react';
import LeaderboardRow from './LeaderboardRow';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
  mapsCompleted?: number;
  serverRecords?: number;
  bonusRecords?: number;
  stageRecords?: number;
}

interface LeaderboardWrapperProps {
  initialLeaderboard: PlayerData[];
  searchQuery: string;
}

export default function LeaderboardWrapper({
  initialLeaderboard,
  searchQuery,
}: LeaderboardWrapperProps) {
  const { theme } = useTheme();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedSteamID, setHighlightedSteamID] = useState<string | null>(null);

  const fullRankedList = useMemo(() => {
    return initialLeaderboard.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  }, [initialLeaderboard]);

  const getBestMatchIndex = (query: string, players: PlayerData[]): number => {
    const lower = query.toLowerCase();
    let bestIndex = -1;
    let bestScore = Infinity;
    players.forEach((player, index) => {
      const name = player.PlayerName.toLowerCase();
      if (name === lower) {
        bestIndex = index;
        bestScore = 0;
      } else if (name.includes(lower)) {
        const score = name.indexOf(lower) + name.length;
        if (score < bestScore) {
          bestIndex = index;
          bestScore = score;
        }
      }
    });
    return bestIndex;
  };

  const totalPages = useMemo(() => {
    return Math.ceil(fullRankedList.length / pageSize);
  }, [fullRankedList.length, pageSize]);

  const displayedPlayers = useMemo(() => {
    if (searchQuery.trim()) {
      const index = getBestMatchIndex(searchQuery, fullRankedList);
      if (index === -1) return [];
      const half = Math.floor(10 / 2);
      const start = Math.max(0, index - half);
      const end = start + 10;
      setHighlightedSteamID(fullRankedList[index].SteamID);
      return fullRankedList.slice(start, end);
    }

    const start = (currentPage - 1) * pageSize;
    return fullRankedList.slice(start, start + pageSize);
  }, [searchQuery, fullRankedList, currentPage, pageSize]);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageRange = (): (number | string)[] => {
    const range: (number | string)[] = [];
    const siblingCount = 1;
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

      range.push(1);
      if (leftSiblingIndex > 2) range.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) range.push(i);
      if (rightSiblingIndex < totalPages - 1) range.push('...');
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentPage}-${pageSize}-${searchQuery}`} // unique key per transition
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          {displayedPlayers.length > 0 ? (
            displayedPlayers.map((player) => (
              <LeaderboardRow
                key={player.SteamID}
                player={{
                  id: player.SteamID,
                  name: player.PlayerName,
                  points: player.GlobalPoints,
                  rank: player.rank,
                  mapsCompleted: player.mapsCompleted,
                  serverRecords: player.serverRecords,
                  bonusRecords: player.bonusRecords,
                  stageRecords: player.stageRecords,
                }}
                isHighlighted={player.SteamID === highlightedSteamID}
              />
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">No players found.</div>
          )}
        </motion.div>
      </AnimatePresence>

      {!searchQuery && totalPages > 1 && (
        <div className="w-full flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 pt-4">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
            >
              <span className="sr-only">First</span>
              <FaChevronLeft className="h-4 w-4 mr-1" />
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {getPageRange().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && paginate(page)}
                className={`relative inline-flex items-center px-4 py-2 border ${
                  currentPage === page
                    ? 'z-10 bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium ${typeof page !== 'number' ? 'cursor-default' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
            >
              <span className="sr-only">Last</span>
              <FaChevronRight className="h-4 w-4 mr-1" />
              <FaChevronRight className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-400">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`text-sm px-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${theme === 'dark' ? 'bg-[#2a2e3a] text-white border-[#3a3f4b]' : 'bg-white text-black border-gray-300'}`}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}