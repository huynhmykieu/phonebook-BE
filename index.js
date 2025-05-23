const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let users = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/persons", (request, response) => {
  response.json(users);
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
  const id = Math.floor(Math.random() * 10000).toString();
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  const existingUser = users.find((user) => user.name === name);
  if (existingUser) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const newUser = {
    id,
    name,
    number,
  };

  users = users.concat(newUser);
  response.json(newUser);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
