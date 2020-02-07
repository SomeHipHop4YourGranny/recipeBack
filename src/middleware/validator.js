import { check, body, validationResult, oneOf } from "express-validator";

import { idChecker, httpErrorCreater } from "../utils";

const userValidationRules = method => {
  switch (method) {
    case "register":
      return [
        body("email").isEmail(),
        body("login")
          .isLength({ min: 5 })
          .isAlphanumeric(),
        body("password")
          .isLength({ min: 6 })
          .isAlphanumeric(),
        check("passwordConfirm")
          .exists()
          .custom((val, { req }) => val === req.body.password)
      ];
    case "login":
      return [
        oneOf([body("login").isEmail(), body("login").isAlphanumeric()]),
        body("password")
          .isLength({ min: 6 })
          .isAlphanumeric()
      ];
    default:
      return [];
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err =>
    extractedErrors.push({
      status: 422,
      message: `${err.msg}`,
      additionalData: `field: ${err.param} , value: ${err.value}`
    })
  );

  return next(httpErrorCreater({ errors: extractedErrors }));
};

const idChecking = (req, res, next) => {
  if (idChecker({ id: req.params.id })) {
    next();
  } else {
    next(
      httpErrorCreater({
        status: 404,
        message: `Cant convert ${req.params.id} to ObjectID`,
        additionalData: `invalid id: ${req.params.id}`
      })
    );
  }
};

export default { idChecking, userValidationRules, validate };
