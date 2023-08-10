const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

let countriesList = [];

const scheme = Joi.object({
  name: Joi.string().required(),
  capital: Joi.string().required(),
  region: Joi.string().required(),
  currency: Joi.string().required(),
  language: Joi.string().required(),
  population: Joi.number().required(),
});
const updateScheme = Joi.object({
  name: Joi.string(),
  capital: Joi.string(),
  region: Joi.string(),
  currency: Joi.string(),
  language: Joi.string(),
  population: Joi.number(),
});

app.get("/api/countries", (req, res) => {
  res.send(countriesList);
});

app.get("/api/countries/:id", (req, res) => {
  const countryId = parseInt(req.params.id);

  const country = countriesList.find((country) => country.id === countryId);
  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }

  res.json(country);
});

app.post("/api/countries/", (req, res) => {
  const { error } = scheme.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const country = {
    id: countriesList.length + 1,
    ...req.body,
  };
  countriesList.push(country);
  res.status(201).send(countriesList);
});

app.put("/api/countries/:id", (req, res) => {
  const countryId = parseInt(req.params.id);

  const country = countriesList.find((country) => country.id === countryId);
  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }
  const { error } = updateScheme.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const keysArray = Object.keys(countriesList[countryId - 1]);
  console.log(keysArray);
  let check = Object.keys(req.body).every((element) =>
    keysArray.includes(element)
  );
  if (check) {
    Object.keys(req.body).forEach((element) => {
      country[element] = req.body[element];
    });
    res.send(country);
  } else {
    res.send("some of the fields are irrelivant");
  }
});

app.delete("/api/countries/:id", (req, res) => {
  const countryId = parseInt(req.params.id);

  const country = countriesList.find((country) => country.id === countryId);
  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }

  countriesList.splice(req.params.id - 1, 1);
  return res.send("Deleted Successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
