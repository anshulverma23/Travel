// Must run AFTER `protect`. Restricts a route to users with role === "admin".
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized as an admin");
};

module.exports = { admin };
