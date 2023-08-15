import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../dao/service/user.service.js";
import { Strategy } from "passport-local";
import { hashPassword, isValidPassword } from "../utils/utils.js";
import { AdminManager } from "../dao/fileSystem/admin.manager.js";

const adminManager = new AdminManager()

const initializePassport = (clientID, clientSecret) => {

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async(sessionUser, done) => { 
    let user = await adminManager.findAdminByEmail(sessionUser.email)
    if(!user)
      user = await userService.findUserByCriteria({email: sessionUser.email});
    done(null, user);
  });

  passport.use(
    "register",
    new Strategy(
      {
        passReqToCallback: true,

        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstName, lastName, email, birthday } = req.body;

        try {
          const user = await userService.findUserByCriteria({email }); 
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            firstName,
            lastName,
            email,
            birthday,
            password: hashPassword(password),
          };
          const result = await userService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done("UserError", error);
        }
      }
    )
  );
  passport.use(
    "login",
    new Strategy(
      {
        passReqToCallback: true,

        usernameField: "email",
      },

      async (req, email, password, done) => {

        try {
          const { email, password } = req.body;

          let user = await adminManager.findAdminByEmailAndPassword(
            email,
            password
          );
          if (!user) {
            user = await userService.findUserByCriteria({email});
            if (!user) {
              console.log("User not exists");

              return done(null, false);
            }
            if (!isValidPassword(user, password)) 
              return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(null, false);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL:
          (process.env.ENV_STAGE === "PRO"
            ? "https://coder-backend-auth.onrender.com"
            : "http://localhost:4000") + "/api/sessions/github/callback",
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email??profile.emails[0].value
        try {
          let user = await userService.findUserByCriteria({
            email,
          });
          if (!user) {
            let newUser = {
              firstName: profile._json.name,
              lastName: "",
              birthday: "",
              email,
              password: "",
              role: "user",
            };
            await userService.createUser(newUser);
            done(null, {name:newUser.firstName + " " + newUser.lastName, ...newUser});
          } else {
            // eslint-disable-next-line no-unused-vars
            const { password, ...rest } = user;
            done(null, { name:user.firstName + " " + user.lastName, ...rest, role: "user" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
export default initializePassport;
