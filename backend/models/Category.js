const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ✅ Virtual "id" that mirrors _id (string form)
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Clean JSON output for the frontend
categorySchema.set("toJSON", {
  virtuals: true,     // include the virtual 'id'
  versionKey: false,  // hide __v
  transform: (_doc, ret) => {
    delete ret._id;   // hide raw _id
  },
});

module.exports = mongoose.model("Category", categorySchema);
