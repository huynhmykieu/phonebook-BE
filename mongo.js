const mongoose = require("mongoose");

const password = process.argv[2];

if (!password) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@cluster0.8mtsnhl.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model("Person", personSchema);

    if (process.argv.length === 3) {
      Person.find({})
        .then((result) => {
          console.log("phonebook:");
          result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
          });
          mongoose.connection.close();
        })
        .catch((err) => {
          console.error("Error retrieving the phonebook:", err.message);
          mongoose.connection.close();
        });
    } else if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];

      const person = new Person({ name, number });

      person
        .save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`);
          mongoose.connection.close();
        })
        .catch((err) => {
          console.error("Error saving data:", err.message);
          mongoose.connection.close();
        });
    } else {
      console.log("Invalid number of arguments.");
      console.log("To add: node mongo.js <password> <name> <number>");
      console.log("To list: node mongo.js <password>");
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
