import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fullName, email, password, institution, graduationYear } = req.body;

    // Initialize the database client with the connection URL from Vercel
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false, // For self-signed certificates (local development)
      },
    });

    try {
      await client.connect();

      // Insert user information into the "users" table
      await client.query(`
        INSERT INTO users (full_name, email, password, institution, graduation_year)
        VALUES ($1, $2, $3, $4, $5)
      `, [fullName, email, password, institution, graduationYear]);

      res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
