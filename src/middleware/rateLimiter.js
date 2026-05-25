import { rateLimit } from "express-rate-limit";

// Strict limiter for sensitive authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 5, // Limit each IP to 5 login/register requests per window
  standardHeaders: "draft-7", // return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
});

// General limiter for public data endpoints (much more relaxed)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 60, // Limit each IP to 60 requests per minute
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Slow down a bit!",
  },
});