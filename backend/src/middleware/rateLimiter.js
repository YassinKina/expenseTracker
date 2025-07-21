import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //we can replace this with firebase
    const userIdentifier = getUniqueUserKey(req);

    //put a user_id or ip address here in production
    const { success } = await ratelimit.limit(userIdentifier);
    if (!success) {
      return res.status(429).json({
        message: "Too many requestsPlease try again later",
      });
    }
    next();
  } catch (error) {
    console.error("Rate limit error:", error);
  }
};

async function getUniqueUserKey(req) {
  if (req.userId) return `ratelimit_user_${req.userId}`;

  // fallback: use IP if no user ID available
  const ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
  return `ratelimit_ip_${ip}`;
  //get the user's id
}
export default rateLimiter;
