import { Recipe } from "../models";
import { httpErrorCreater } from "../utils";

const index = (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  Recipe.find()
    .populate("comments.comment.author")
    .populate("categories.category")
    .populate("author")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then(recipe => {
      Recipe.countDocuments().then(count => {
        res.status(200).send({ recipe, pagi: { page, count, perPage } });
      });
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const read = (req, res, next) => {
  Recipe.findOne({
    _id: req.params.id
  })
    .populate("comments.comment._author")
    .populate("categories._category")
    .populate("_author")
    .then(recipe => {
      if (recipe && recipe !== null) {
        const newRecipe = recipe;
        newRecipe.meta.views = recipe.meta.views + 1;
        newRecipe.save();
        res.status(200).send(recipe);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `recipe: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const create = (req, res, next) => {
  const data = new Recipe(req.body);
  data
    .save()
    .then(recipe => {
      res.status(200).send(recipe);
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const deleteOne = (req, res, next) => {
  Recipe.findOneAndDelete({ _id: req.params.id })
    .then(recipe => {
      if (recipe && recipe !== null) {
        res.status(200).send(recipe);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `recipe: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const update = (req, res, next) => {
  Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .populate({
      path: "comments.comment",
      populate: {
        path: "author"
      }
    })
    .then(recipe => {
      if (recipe && recipe !== null) {
        res.status(200).send(recipe);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `recipe: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

export default { index, read, create, deleteOne, update };
