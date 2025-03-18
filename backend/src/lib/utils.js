import jwt from "jsonwebtoken";

// Function to generate JWT token and set it in cookies
export const generateToken = (userId, res) => {
  // Generate a JWT token with userId as payload, using a secret key
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: "7d" } // Token expires in 7 days
  );

  // Set the JWT token in an HTTP-only cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (milliseconds)
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (protection against XSS attacks)
    sameSite: "strict", // Prevents CSRF (Cross-Site Request Forgery) attacks
    secure: process.env.NODE_ENV !== "development", // Only send cookies over HTTPS in production
  });

  return token; // Return the generated token
};

// jwt.sign is a method from the jsonwebtoken (JWT) library used to create a JWT token. It digitally signs the token using a secret key, making it secure and verifiable.

// Parameters:
// payload → The data you want to include in the token (e.g., userId).
// secretOrPrivateKey → A secret key used to sign the token (stored in environment variables for security).
// options (optional) → Additional settings like expiration time.

// res.cookie() is a method in Express.js used to set cookies in the browser from the server.

// Syntax:
// res.cookie(name, value, options)
// Parameters:
// name → The name of the cookie.
// value → The value stored in the cookie (e.g., a JWT token).
// options (optional) → Configuration options like expiration, security settings, etc.


