import express from "express";
import { httpErrorCreater } from "../utils";
import { auth, recipe, category, ingredient } from "../controllers";
import { validator } from "../middleware";

const router = express.Router();

router.get("/session", (req, res, next) =>
  req.session.passport
    ? res.status(200).send(req.session.passport)
    : next(httpErrorCreater({ status: 401 }))
);

// Login, Register and Logout
router.post("/login", [
  auth.checkNotAuth,
  validator.userValidationRules("login"),
  validator.validate,
  auth.signIn
]);
router.post("/register", [
  auth.checkNotAuth,
  validator.userValidationRules("register"),
  validator.validate,
  auth.signUp
]);
router.get("/logout", [auth.checkAuth, auth.logout]);

// Recipe
router.get("/recipe", recipe.index);
router.get("/recipe/:id", [validator.idChecking, recipe.read]);
router.post("/recipe", [auth.checkAuth, recipe.create]);
router.delete("/recipe/:id", [
  auth.checkAuth,
  validator.idChecking,
  recipe.deleteOne
]);
router.put("/recipe/:id", [
  auth.checkAuth,
  validator.idChecking,
  recipe.update
]);
// Category
router.get("/category", category.index);
router.get("/category/:id", [validator.idChecking, category.read]);
router.post("/category", [auth.checkAuth, category.create]);
router.delete("/category/:id", [
  auth.checkAuth,
  validator.idChecking,
  category.deleteOne
]);
router.put("/category/:id", [
  auth.checkAuth,
  validator.idChecking,
  category.update
]);
// Ingredient
router.get("/ingredient", ingredient.index);
router.get("/ingredient/:id", [validator.idChecking, ingredient.read]);
router.post("/ingredient", [auth.checkAuth, ingredient.create]);
router.delete("/ingredient/:id", [
  auth.checkAuth,
  validator.idChecking,
  ingredient.deleteOne
]);
router.put("/ingredient/:id", [
  auth.checkAuth,
  validator.idChecking,
  ingredient.update
]);

export default router;
