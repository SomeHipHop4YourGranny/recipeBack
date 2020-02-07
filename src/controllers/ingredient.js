import { Ingredient } from "../models";
import { httpErrorCreater } from "../utils";

const index = (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;

  Ingredient.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then(ingredient => {
      Ingredient.countDocuments().then(count => {
        res.status(200).send({ ingredient, pagi: { page, count, perPage } });
      });
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const read = (req, res, next) => {
  Ingredient.findOne({
    _id: req.params.id
  })
    .then(ingredient => {
      if (ingredient && ingredient !== null) {
        res.status(200).send(ingredient);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `ingredient: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const create = (req, res, next) => {
  const data = new Ingredient(req.body);
  data
    .save()
    .then(ingredient => {
      res.status(200).send(ingredient);
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const deleteOne = (req, res, next) => {
  Ingredient.findOneAndDelete({ _id: req.params.id })
    .then(ingredient => {
      if (ingredient && ingredient !== null) {
        res.status(200).send(ingredient);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `ingredient: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const update = (req, res, next) => {
  Ingredient.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  })
    .then(ingredient => {
      if (ingredient && ingredient !== null) {
        res.status(200).send(ingredient);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `ingredient: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

export default { index, read, create, deleteOne, update };
