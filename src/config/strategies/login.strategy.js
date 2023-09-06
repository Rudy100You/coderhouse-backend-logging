import { Strategy } from "passport-local";
import { isValidPassword } from "../../utils/utils.js";
import adminManager from "../../dao/fileSystem/admin.manager.js";
import userService from "../../services/user.service.js";

export default () => new Strategy(
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