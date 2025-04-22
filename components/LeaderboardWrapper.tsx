'use client';

import React, { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import LeaderboardRow from './LeaderboardRow';
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
}

export default function LeaderboardWrapper({ initialLeaderboard }: LeaderboardWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage, setPlayersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const getPointsStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-gray-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-yellow-700 text-white';
    return theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800';
  };

  const sortedLeaderboard = useMemo(() => {
    return [...initialLeaderboard].sort((a, b) => b.GlobalPoints - a.GlobalPoints);
  }, [initialLeaderboard]);

  const { currentPlayers, highlightedId, totalPages } = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    let players: PlayerData[] = [];
    let highlightedId: string | null = null;

    if (trimmedQuery) {
      const matchIndex = sortedLeaderboard.findIndex(
        (player) => player.PlayerName.toLowerCase().startsWith(trimmedQuery)
      );

      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 4);
        const end = Math.min(sortedLeaderboard.length, start + 10);
        players = sortedLeaderboard.slice(start, end);
        highlightedId = sortedLeaderboard[matchIndex].SteamID;
      }
    } else {
      const last = currentPage * playersPerPage;
      const first = last - playersPerPage;
      players = sortedLeaderboard.slice(first, last);
    }

    return {
      currentPlayers: players,
      highlightedId,
      totalPages: Math.ceil(sortedLeaderboard.length / playersPerPage),
    };
  }, [searchQuery, currentPage, playersPerPage, sortedLeaderboard]);

  const paginate = (page: number) => setCurrentPage(page);

  const getPageRange = () => {
    const delta = 2;
    const pages = [];
    const total = totalPages;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search player..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 mb-2 rounded border border-gray-600 bg-gray-800 text-white text-sm w-64"
        />
      </div>

      {/* Header */}
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1f2e] text-gray-400 rounded-t-lg flex justify-between">
        <div className="w-1/6">Rank</div>
        <div className="w-3/6">Player</div>
        <div className="w-2/6 text-right">Points</div>
      </div>

      {/* Player Rows with animation */}
      <div className={`space-y-2 transition-all duration-500 ease-in-out ${searchQuery ? 'animate-fade-slide' : ''}`}>
        {currentPlayers.length > 0 ? (
          currentPlayers.map((player) => {
            const globalIndex = sortedLeaderboard.findIndex(p => p.SteamID === player.SteamID);
            return (
              <LeaderboardRow
                key={player.SteamID}
                player={{
                  id: player.SteamID,
                  name: player.PlayerName,
                  points: player.GlobalPoints,
                  rank: globalIndex + 1,
                  mapsCompleted: player.mapsCompleted ?? 0,
                  serverRecords: player.serverRecords ?? 0,
                  bonusRecords: player.bonusRecords ?? 0,
                  stageRecords: player.stageRecords ?? 0,
                }}
                getPointsStyle={getPointsStyle}
                isHighlighted={player.SteamID === highlightedId}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-400 text-sm">No players found.</div>
        )}
      </div>

      {/* Pagination */}
      {!searchQuery && (
        <div className="flex justify-center space-x-1 flex-wrap items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {getPageRange().map((page, index) => (
            <button
              key={index}
              disabled={page === '...'}
              onClick={() => typeof page === 'number' && paginate(page)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${page === '...' ? 'cursor-default' : ''}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Player Count Selector */}
      <div className="flex justify-end">
        <label className="text-sm mr-2">Show:</label>
        <select
          className="bg-gray-700 text-white p-1 rounded border border-gray-600"
          value={playersPerPage}
          onChange={(e) => {
            setPlayersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[10, 25, 50, 100].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
