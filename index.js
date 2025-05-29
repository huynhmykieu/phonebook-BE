require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://phonebook-fe-7ud0.onrender.com",
  })
);

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(
        persons.map((p) => ({
          id: p._id.toString(),
          name: p.name,
          number: p.number,
        }))
      );
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const date = new Date();
  Person.countDocuments({})
    .then((count) => {
      const info = `Phonebook has info for ${count} people`;
      response.send(`<div>
        <p>${info}</p>
        <p>${date}</p>
        </div>`);
    })
    .catch((error) => next(error));
});

app.get("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({ error: "Name must be unique" });
      }

      const person = new Person({ name, number });
      return person
        .save()
        .then((savedPerson) => response.status(201).json(savedPerson));
    })
    .catch((error) => next(error));
});

app.put("/persons/:id", (request, response, next) => {
  const { number } = request.body;

  if (!number) {
    return response.status(400).json({ error: "Number is missing" });
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      console.log("updatedPerson", updatedPerson);

      if (updatedPerson) {
        return response.json(updatedPerson);
      } else {
        return response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

// Unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error("Error:", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
