js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { date, nom } = req.body;

  if (!date || !nom) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: '1355k0tcjh0zCK1DFrb82BS5FX4uEIRcv_zfo2ntAn3Q',
      range: 'Données!A:B',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[date, nom]]
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
