import { passport } from "../config";
import { httpErrorCreater } from "../utils";

const signIn = (req, res, next) => {
  passport.authenticate("signin", (error, user, message) => {
    if (error) {
      return next(httpErrorCreater({ message: error }));
    }
    if (!user) {
      return next(httpErrorCreater({ status: 401, message }));
    }
    return req.login(user, loginErr => {
      if (loginErr) {
        return next(httpErrorCreater({ status: 401, message: loginErr }));
      }
      return res.status(200).send({ success: true, message });
    });
  })(req, res, next);
};

const signUp = (req, res, next) => {
  passport.authenticate("signup", (error, user, message) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(401).send({ success: false, message });
    }
    return req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(201).send({ success: true, message });
    });
  })(req, res, next);
};
const logout = (req, res, next) => {
  req.session.destroy(error => {
    if (error)
      next(httpErrorCreater({ status: error.status, message: error.message }));
    res.status(200).send({ status: 200, message: "Logout success" });
  });
};

const checkAuth = (req, res, next) =>
  req.session.passport
    ? next()
    : next(httpErrorCreater({ status: 401, message: "not Auth" }));

const checkNotAuth = (req, res, next) =>
  req.session.passport
    ? next(httpErrorCreater({ status: 400, message: "Alredy authentificated" }))
    : next();

export default { signIn, signUp, checkAuth, checkNotAuth, logout };
