import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT PlayerName, SteamID, GlobalPoints, mapsCompleted, serverRecords, bonusRecords, stageRecords FROM PlayerStats WHERE SteamID = ?',
      [id]
    );

    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error in getPlayer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}