'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'
import LeaderboardWrapper from './LeaderboardWrapper';

async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/getPlayers', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  return res.json();
}

export default function Leaderboard() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPlayers()
      .then(data => {
        setLeaderboard(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`w-full md:w-3/5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-lg p-4 sm:p-6`}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Top Players</h2>
        <LeaderboardWrapper initialLeaderboard={leaderboard} />
      </div>

      <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 md:space-y-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 sm:p-6 shadow-lg`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">How to get Global Points</h2>
          <ul className="space-y-2">
            {[
              { action: "Complete Map 1st", points: 2000 },
              { action: "Beat SR", points: 1000 },
              { action: "Complete Map", points: 31 },
              { action: "Beat PB", points: 20 },
            ].map((item, index) => (
              <li key={index} className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-2 sm:p-3`}>
                <span className="text-sm sm:text-base">{item.action}</span>
                <span className="font-semibold text-green-400 text-sm sm:text-base">+{item.points} Points</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 sm:p-6 shadow-lg`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">In-game Ranks</h2>
          <ul className="space-y-2">
            {[
                        { rank: "☠ God", color: "text-red-400", top: "1" },
                        { rank: "✦ Godly", color: "text-red-400", top: "2" },
                        { rank: "✹ Godlike",color: "text-red-400", top: "3" },
                        { rank: "✧ MYTHICAL", color: "text-purple-400", top: "10" },
                        { rank: "MYTHICAL", color: "text-yellow-400", top: "50" },
                        { rank: "✯ ZENITH", color: "text-blue-400",  top: "3%" },
                        { rank: "ZENITH", color: "text-yellow-600", top: "5%" },
                        { rank: "▲ ASCENDENT", color: "text-gray-400", top: "8%" },
                        { rank: "ASCENDENT", color: "text-yellow-600", top: "10%" },
                        { rank: "❂ GRANDMASTER", color: "text-gray-400", top: "12%" },
                        { rank: "GRANDMASTER", color: "text-yellow-600", top: "15%" },
                        { rank: "✩ LEGENDARY", color: "text-gray-400", top: "18%" },
                        { rank: "LEGENDARY", color: "text-yellow-600", top: "20%" },
                        { rank: "✶ MASTER", color: "text-gray-400", top: "25%" },
                        { rank: "MASTER", color: "text-yellow-600", top: "30%" },
                        { rank: "✸ ELITE", color: "text-gray-400", top: "35%" },
                        { rank: "ELITE", color: "text-yellow-600", top: "40%" },
                        { rank: "✷ PRO", color: "text-gray-400", top: "45%" },
                        { rank: "PRO", color: "text-yellow-600", top: "50%" },
                        { rank: "✹ EXPERT", color: "text-gray-400", top: "55%" },
                        { rank: "EXPERT", color: "text-yellow-600", top: "60%" },
                        { rank: "❈ VETERAN", color: "text-gray-400", top: "65%" },
                        { rank: "VETERAN", color: "text-yellow-600", top: "70%" },
                        { rank: "✱ SKILLED", color: "text-gray-400", top: "75%" },
                        { rank: "SKILLED", color: "text-yellow-600", top: "78%" },
                        { rank: "✧ APPRENTICE", color: "text-gray-400", top: "82%" },
                        { rank: "APPRENTICE", color: "text-yellow-600", top: "85%" },
                        { rank: "✥ NOVICE", color: "text-gray-400", top: "88%" },
                        { rank: "NOVICE", color: "text-yellow-600", top: "90%" },
                        { rank: "✪ ROOKIE", color: "text-gray-400", top: "92%" },
                        { rank: "ROOKIE", color: "text-yellow-600", top: "95%" },
                        { rank: "✾ BEGINNER", color: "text-gray-400", top: "97%" },
                        { rank: "BEGINNER", color: "text-yellow-600", top: "98%" },
                        { rank: "✿ NEW", color: "text-gray-400", top: "99%" },
                        { rank: "Unranked", color: "text-yellow-600", top: "Unranked" },
            ].map((item, index) => (
              <li key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-2 sm:p-3 flex justify-between items-center`}>
                <span className={`font-semibold ${item.color} text-sm sm:text-base`}>[{item.rank}]</span>
                <span className="text-xs sm:text-sm">Top {item.top}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
