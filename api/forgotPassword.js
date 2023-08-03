import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

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

      // Generate a password reset token (you can use a library like `uuid` for this)
      const resetToken = generatePasswordResetToken();

      // Store the token and its expiration time in the database
      await client.query(`
        UPDATE users SET reset_token = $1, reset_token_expiration = NOW() + INTERVAL '1 hour' WHERE email = $2
      `, [resetToken, email]);

      // Send the password reset email to the user (use a library like Nodemailer for this)
      sendPasswordResetEmail(email, resetToken);

      res.status(200).json({ message: 'Password reset email sent successfully!' });
    } catch (error) {
      console.error('Error during forgot password:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
