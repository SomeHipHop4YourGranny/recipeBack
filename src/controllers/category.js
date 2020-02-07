import { Category } from "../models";
import { httpErrorCreater } from "../utils";

const index = (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  Category.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then(category => {
      Category.countDocuments().then(count => {
        res.status(200).send({ category, pagi: { page, count, perPage } });
      });
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const read = (req, res, next) => {
  Category.findOne({
    _id: req.params.id
  })
    .then(category => {
      if (category && category !== null) {
        res.status(200).send(category);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `category: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const create = (req, res, next) => {
  const data = new Category(req.body);
  data
    .save()
    .then(category => {
      res.status(200).send(category);
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

const deleteOne = (req, res, next) => {
  Category.findOneAndDelete({ _id: req.params.id })
    .then(category => {
      if (category && category !== null) {
        res.status(200).send(category);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `category: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};
const update = (req, res, next) => {
  Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  })
    .then(category => {
      if (category && category !== null) {
        res.status(200).send(category);
      } else {
        next(
          httpErrorCreater({
            status: 404,
            additionalData: `category: ${req.params.id}`
          })
        );
      }
    })
    .catch(error => {
      next(httpErrorCreater({ status: error.status, message: error.message }));
    });
};

export default { index, read, create, deleteOne, update };
