const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not identified" });
    }
    const hasRole = allowedRoles.includes(req.user.role);

    if (!hasRole) {
      return res.status(403).json({ 
        message: `Access Denied: You do not have the required permissions (${allowedRoles.join(", ")} only not ${req.user.role})` 
      });
    }
    next();
  };
};

export default roleMiddleware;