// api/register.js

import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, email, password, institution, graduationYear } = req.body;

  // Perform client-side validation if needed

  // Create a new PostgreSQL client
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    // Check if the email is already registered
    const existingUser = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Perform the registration query to insert the new user into the database
    await client.query(
      `INSERT INTO users (full_name, email, password, institution, graduation_year) VALUES ($1, $2, $3, $4, $5)`,
      [fullName, email, password, institution, graduationYear]
    );

    // Registration successful
    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the PostgreSQL client
    await client.end();
  }
}
