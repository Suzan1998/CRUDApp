const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/items");
const app = express(); // to use Express

app.use(express.urlencoded({ extended: true }));
const mongodb = //to connect to mongo DB
  "mongodb+srv://cnq:<myPassword>@cluster0.7uqde.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to mongo yeeh!!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs"); // as we used enhanced javaScript

app.get("/", (req, res) => {
  //index page with all items rendered
  res.redirect("/get-items");
});

app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => {
      console.log(result);
      res.render("index", { items: result });
    })
    .catch((err) => console.log(err));
});
app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.post("/items", (req, res) => {
  console.log(req.body);
  const item = Item(req.body); // create new item with the body data from request
  console.log(item);
  item
    .save()
    .then(() => {
      res.redirect("/get-items");
    })
    .catch((err) => console.log(err));
});
app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findById(id).then((result) => {
    console.log("result", result);
    res.render("item-detail", { item: result });
  });
});
app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id).then((result) => {
    res.json({ redirect: "/get-items" });
  });
});
app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body).then((result) => {
    res.json({ msg: "Updated Successfully" });
  });
});
// must be at the end it will render error page when wrong api given
app.use((req, res) => {
  res.render("error");
});
