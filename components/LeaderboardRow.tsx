'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaTrophy, FaSteam, FaChevronDown } from 'react-icons/fa';

interface Player {
  id: string;
  name: string;
  points: number;
  rank: number;
  mapsCompleted: number;
  serverRecords: number;
  bonusRecords: number;
  stageRecords: number;
}

const getTrophyColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400'; // Gold
  if (rank === 2) return 'text-gray-300';   // Silver
  if (rank === 3) return 'text-yellow-700'; // Bronze
  return '';
};

const LeaderboardRow = ({
  player,
  getPointsStyle,
}: {
  player: Player;
  getPointsStyle: (rank: number) => string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const trophyColor = getTrophyColor(player.rank);
  const pointsStyle = getPointsStyle(player.rank);

  return (
    <div className="mb-2 rounded-lg overflow-hidden bg-[#1a1f2e] shadow-sm">
      {/* Header Row */}
      <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-800 transition">
        {/* Rank + Player */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            {player.rank <= 3 ? (
              <FaTrophy className={`text-xl mr-2 ${trophyColor}`} />
            ) : (
              <span className="text-sm font-semibold w-6 text-white">{player.rank}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={`https://steamcommunity.com/profiles/${player.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
              title="View Steam Profile"
            >
              <FaSteam />
            </a>
            <Link
              href={`/leaderboard/${player.id}`}
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              {player.name}
            </Link>
          </div>
        </div>

        {/* Points + Chevron */}
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${pointsStyle}`}>
            {player.points.toLocaleString()}
          </span>
          <button
            className={`text-purple-400 hover:text-purple-300 text-sm transform transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            aria-label="Toggle details"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div className="bg-[#252b3d] px-6 py-4 text-sm text-gray-300 space-y-2">
          <p>
            <span className="text-white font-medium">Maps Completed:</span> {player.mapsCompleted}
          </p>
          <p>
            <span className="text-white font-medium">Server Records:</span> {player.serverRecords}
          </p>
          <p>
            <span className="text-white font-medium">Bonus Records:</span> {player.bonusRecords}
          </p>
          <p>
            <span className="text-white font-medium">Stage Records:</span> {player.stageRecords}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardRow;
