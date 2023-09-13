import CustomError from "../errors/CustomError.js";
import ErrorTypes from "../errors/ErrorTypes.js";
import { equalsIgnoreCase } from "../utils.js";

const isAPIrequest = (req)=>{
  return req.baseUrl.includes('/api')
}

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
    if (req.isAuthenticated() && req.user && equalsIgnoreCase(req.user, "ADMIN")) {
      next();
  } else {
    if(isAPIrequest)
      CustomError.throwNewError({name: ErrorTypes.USER_NOT_ALLOWED_ERROR})
    return res.redirect("/error");
  }
}

export const currentUserIsUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user && equalsIgnoreCase(req.user, "USER")) {
    next();
} else {
    if(isAPIrequest)
      CustomError.throwNewError({name: ErrorTypes.USER_NOT_ALLOWED_ERROR})
    return res.redirect("/error");
}
}