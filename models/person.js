const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
if (!url) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const phoneRegex = /^\d{2,3}-\d+$/;

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must be at least 3 characters long"],
    required: [true, "Name is required"],
  },
  number: {
    type: String,
    minlength: [8, "Phone number must be at least 8 characters"],
    required: [true, "Phone number is required"],
    validate: {
      validator: function (v) {
        return phoneRegex.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Must be in format XX-XXXXXXX`,
    },
  },
});

module.exports = mongoose.model("Person", personSchema);
