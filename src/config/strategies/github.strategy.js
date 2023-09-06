
import GitHubStrategy from "passport-github2";
import userService from "../../services/user.service.js";

export default (clientID, clientSecret)=> new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL:
        (process.env.ENV_STAGE === "PRO"
          ? process.env.APP_URL
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