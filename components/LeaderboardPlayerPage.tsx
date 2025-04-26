'use client';

import React from 'react';

interface LeaderboardPlayerPageProps {
  player: {
    PlayerName: string;
    SteamID: string;
    GlobalPoints: number;
    mapsCompleted?: number;
    serverRecords?: number;
    bonusRecords?: number;
    stageRecords?: number;
  };
}

export default function LeaderboardPlayerPage({ player }: LeaderboardPlayerPageProps) {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-2xl shadow-md border border-gray-700">
      <h2 className="text-3xl font-bold mb-4 text-center">{player.PlayerName}</h2>

      <div className="grid grid-cols-1 gap-3 text-sm sm:text-base">
        <InfoRow label="SteamID" value={player.SteamID} />
        <InfoRow label="Global Points" value={player.GlobalPoints.toLocaleString()} />
        <InfoRow label="Maps Completed" value={player.mapsCompleted ?? 0} />
        <InfoRow label="Server Records" value={player.serverRecords ?? 0} />
        <InfoRow label="Bonus Records" value={player.bonusRecords ?? 0} />
        <InfoRow label="Stage Records" value={player.stageRecords ?? 0} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b border-gray-700 py-2">
      <span className="text-gray-400">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
