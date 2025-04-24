import { NextResponse } from 'next/server';

type GameDigPlayer = {
  name: string;
  score?: number;
  time?: number;
};

export async function GET() {
  // Dynamically import gamedig and assert type after it's resolved
  const GameDigModule = await import('gamedig');
  const GameDig = GameDigModule.default;

  const rawServerIPs = process.env.SERVER_IPS;

  if (!rawServerIPs) {
    console.warn('⚠️ SERVER_IPS environment variable is not defined.');
    return NextResponse.json([], { status: 200 });
  }

  let serverIPs: { ip: string; port: number }[];

  try {
    serverIPs = JSON.parse(rawServerIPs);
    if (!Array.isArray(serverIPs)) throw new Error('SERVER_IPS is not an array');
  } catch (err) {
    console.error('❌ Failed to parse SERVER_IPS:', err);
    return NextResponse.json({ error: 'Invalid SERVER_IPS format' }, { status: 500 });
  }

  try {
    const serversData = await Promise.all(
      serverIPs.map(async (server) => {
        try {
          const state = await GameDig.query({
            type: 'csgo',
            host: server.ip,
            port: server.port,
          });

          return {
            name: state.name,
            map: state.map,
            numPlayers: state.numplayers,
            maxPlayers: state.maxplayers,
            players: state.players.map((player: GameDigPlayer) => player.name.trim()),
            bots: state.bots.length,
            connect: state.connect,
            ping: state.ping,
          };
        } catch (error) {
          console.error(`⚠️ Error querying server ${server.ip}:${server.port}:`, error);
          return null;
        }
      })
    );

    const validServers = serversData.filter(Boolean);
    return NextResponse.json(validServers);
  } catch (error) {
    console.error('❌ Error fetching server data:', error);
    return NextResponse.json({ error: 'Failed to fetch server data' }, { status: 500 });
  }
}
