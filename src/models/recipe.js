import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    instruction: {
      type: String,
      required: true
    },
    advice: {
      type: String
    },
    addData: {
      calories: {
        type: String
      },
      proteins: {
        type: String
      },
      fats: {
        type: String
      },
      carbohydrates: {
        type: String
      },
      portion: {
        type: String
      },
      time: {
        type: String
      }
    },
    imgs: [
      {
        img: {
          title: {
            type: String,
            required: true,
            default: "img"
          },
          src: {
            type: String,
            required: true
          }
        }
      }
    ],
    meta: {
      views: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        default: 0
      }
    },
    categories: [
      {
        _category: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Category"
        }
      }
    ],
    comments: [
      {
        comment: {
          text: {
            type: String,
            required: true
          },
          _author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          }
        }
      }
    ],
    _author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

schema.path("imgs").validate(imgs => {
  if (!imgs) {
    return false;
  }
  if (imgs.length === 0) {
    return false;
  }
  return true;
}, "Need at least 1 image");
schema.path("categories").validate(categories => {
  if (!categories) {
    return false;
  }
  if (categories.length === 0) {
    return false;
  }
  return true;
}, "Need at least 1 category");

export default mongoose.model("Recipe", schema);
