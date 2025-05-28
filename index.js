require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      console.error("Error fetching persons:", error.message);
      response.status(500).send({ error: "Failed to fetch persons" });
    });
});

app.get("/info", (request, response) => {
  const date = new Date();
  const info = `Phonebook has info for ${users.length} people`;
  response.send(`<div>
        <p>${info}</p>
        <p>${date}</p>
        </div>`);
});

app.get("/persons/:id", (request, response) => {
  const id = request.params.id;
  const user = users.find((user) => user.id === id);

  if (user) {
    response.json(user);
  } else {
    response.status(404).send({ error: "User not found" });
  }
});

app.delete("/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  users = users.filter((user) => user.id !== id);
  response.json(users);

  response.status(204).end();
});

app.post("/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  // const existingUser = users.find((user) => user.name === name);
  // if (existingUser) {
  //   return response.status(400).json({ error: "Name must be unique" });
  // }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
    })
    .catch((error) => {
      console.error("Error saving new person:", error.message);
      return response.status(500).send({ error: "Failed to save person" });
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
