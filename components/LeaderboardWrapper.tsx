'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import LeaderboardRow from './LeaderboardRow';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

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
  const { theme } = useTheme();

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = initialLeaderboard.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(initialLeaderboard.length / playersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPointsStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-gray-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-yellow-700 text-white';
    return theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800';
  };

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
      <div className="space-y-2">
          {/* Table Header */}
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1f2e] text-gray-400 rounded-t-lg flex justify-between">
        <div className="w-1/6">Rank</div>
        <div className="w-3/6">Player</div>
        <div className="w-2/6 text-right">Points</div>
      </div>
        {currentPlayers.map((player, index) => (
          <LeaderboardRow
            
            key={player.SteamID}
            player={{
              id: player.SteamID,
              name: player.PlayerName,
              points: player.GlobalPoints,
              rank: indexOfFirstPlayer + index + 1,
              mapsCompleted: player.mapsCompleted ?? 0,
              serverRecords: player.serverRecords ?? 0,
              bonusRecords: player.bonusRecords ?? 0,
              stageRecords: player.stageRecords ?? 0,
            }}
            getPointsStyle={getPointsStyle}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        theme={theme}
      />

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
            <option key={count} value={count}>{count}</option>
          ))}
        </select>
      </div>
    </div>
  );
}


export const Pagination = ({ currentPage, totalPages, paginate, theme }: { currentPage: number, totalPages: number, paginate: (pageNumber: number) => void, theme: string }) => {
  const getPageRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="w-full flex justify-center">
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
    </div>
  );
};