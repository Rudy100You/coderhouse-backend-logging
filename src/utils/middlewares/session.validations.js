import { equalsIgnoreCase } from "../utils.js";

export const validateSession = (req, res, next) => {
    if (req.isAuthenticated()) {
      // Session is valid, proceed to the next middleware or route handler
      next();
    } else {
      // Session is not valid or not present, redirect to login page or return an error
      res.redirect("/login");
    }
  };
  
export const validateSessionAfterLogin = (req, res, next) => {
if (req.isAuthenticated()) {
    res.redirect("/profile");
} else {
    // Session is not valid or not present, redirect to login page or return an error
    next();
}
};

export const currentUserIsAdmin = (req, res, next) => {
    if (req.isAuthenticated() && equalsIgnoreCase(req.user, "ADMIN")) {
      next();
  } else {
      res.redirect("/error");
  }
}

export const currentUserIsUser = (req, res, next) => {
  if (req.isAuthenticated() && equalsIgnoreCase(req.user, "USER")) {
    next();
} else {
    res.redirect("/error");
}
}