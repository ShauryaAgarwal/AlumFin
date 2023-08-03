import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Initialize the database client with the connection URL from Vercel
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false, // For self-signed certificates (local development)
      },
    });

    try {
      await client.connect();

      // Fetch user information from the "users" table based on the email
      const result = await client.query(`
        SELECT * FROM users WHERE email = $1
      `, [email]);

      if (result.rows.length === 0) {
        // User with the given email not found
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        // Incorrect password
        return res.status(401).json({ message: 'Incorrect password' });
      }

      res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
