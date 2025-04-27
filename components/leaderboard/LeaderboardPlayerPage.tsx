'use client';

import React, { useEffect, useState } from 'react';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
  mapsCompleted?: number;
  serverRecords?: number;
  bonusRecords?: number;
  stageRecords?: number;
}

export default function LeaderboardPlayerPage({ playerId }: { playerId: string }) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      try {
        const res = await fetch(`/api/getPlayer?id=${playerId}`);
        if (!res.ok) throw new Error('Failed to fetch player');
        const data = await res.json();
        setPlayer(data);
      } catch (error) {
        console.error('Error fetching player:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-400">
        Loading player information...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center p-10 text-red-500">
        Player not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700">
      <h1 className="text-3xl font-bold text-center mb-6">{player.PlayerName}</h1>

      <div className="space-y-4">
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
    <div className="flex justify-between px-4 py-2 bg-gray-800 rounded-md">
      <span className="text-gray-400">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
