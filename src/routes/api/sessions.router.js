import { Router } from "express";
import passport from "passport";
import { validateSession } from "../../utils/middlewares/session.validations.js";

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/error",
    successRedirect: "/login",
  }),
  (req, res) => res.status(200)
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { successRedirect: "/profile" }),
  () => {
    return true;
  }
);
sessionsRouter.get(
  "/github",
  passport.authenticate("github"),
  async (req, res) => {
    res.status(200);
  }
);

sessionsRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  }),
  async (req, res) => {
    res.status(200);
  }
);

sessionsRouter.use(validateSession);
sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.redirect(500, "/error");
    } else {
      res.redirect("/login");
    }
  });
});

sessionsRouter.get("/current", (req, res) => {
  res.send(req.user);
});

export default sessionsRouter;
