//import LeaderboardPlayerPage from '@/components/LeaderboardPlayerPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
  mapsCompleted?: number;
  serverRecords?: number;
  bonusRecords?: number;
  stageRecords?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // fallback for dev

// Generate static paths for each player
export async function generateStaticParams() {
  const res = await fetch(`${API_BASE}/api/getPlayers`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch players in generateStaticParams');
    return [];
  }

  const players: PlayerData[] = await res.json();

  return players.map((player) => ({
    id: player.SteamID,
  }));
}

// Page component for each player
export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const playerRes = await fetch(`${API_BASE}/api/getPlayer?id=${params.id}`, {
    cache: 'no-store',
  });

  if (!playerRes.ok) {
    return (
      <>
        <Header />
        <div className="p-6 text-red-500 text-center">
          <h1 className="text-xl font-bold">Player Not Found</h1>
          <p>Could not find the player with ID: {params.id}</p>
        </div>
        <Footer />
      </>
    );
  }

  const player: PlayerData = await playerRes.json();

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-6 bg-gray-800 text-white rounded-lg mt-10 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{player.PlayerName}</h1>
        <p className="mb-2"><strong>SteamID:</strong> {player.SteamID}</p>
        <p className="mb-2"><strong>Global Points:</strong> {player.GlobalPoints.toLocaleString()}</p>
        <p className="mb-2"><strong>Maps Completed:</strong> {player.mapsCompleted ?? 0}</p>
        <p className="mb-2"><strong>Server Records:</strong> {player.serverRecords ?? 0}</p>
        <p className="mb-2"><strong>Bonus Records:</strong> {player.bonusRecords ?? 0}</p>
        <p className="mb-2"><strong>Stage Records:</strong> {player.stageRecords ?? 0}</p>
      </div>
      <Footer />
    </>
  );
}
