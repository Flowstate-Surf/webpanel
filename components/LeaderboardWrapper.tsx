'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PCLeaderboard, MobileLeaderboard, Pagination } from './LeaderboardClient';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
}

interface LeaderboardWrapperProps {
  initialLeaderboard: PlayerData[];
}

export default function LeaderboardWrapper({ initialLeaderboard }: LeaderboardWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  //const playersPerPage = 50;
  const [playersPerPage, setPlayersPerPage] = useState(10);
  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {/* Render different depending on the device */}
      {isMobile ? (
        <MobileLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
          theme={theme}
        />
      ) : (
        <PCLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
          theme={theme}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        theme={theme}
      />
    {/*Adding a dialog for the user to choose how many users show up in the leaderboard */}
    <div className = "flex justify-end">
        <label className = "text-sm mr-2">Show:</label>
        <select
          className="bg-gray-700 text-white p-1 rounded border border-gray-600"
          value={playersPerPage}
          onChange={(e) => setPlayersPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}