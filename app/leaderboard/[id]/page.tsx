import LeaderboardPlayerPage from '@/components/leaderboard/LeaderboardPlayerPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper to determine base URL for fetch
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // If deployed on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return 'http://localhost:3000';
}

// Generate static params for each player
export async function generateStaticParams() {
  const res = await fetch(`${getBaseUrl()}/api/getPlayers`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch players in generateStaticParams');
    return [];
  }

  const players = await res.json();

  return players.map((player: { SteamID: string }) => ({
    id: player.SteamID,
  }));
}

// Main page
export default function PlayerPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <LeaderboardPlayerPage playerId={params.id} />
      <Footer />
    </>
  );
}
