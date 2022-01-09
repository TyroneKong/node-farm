const fs = require("fs");
const http = require("http");
const express = require("express");
// const bodyParser = require("body-parser");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////
//// FILES

// // asynchronous
const file = fs.readFile("./txt/input.txt", "utf8", (err, data1) => {
  fs.readFile("./txt/append.txt", "utf8", (err, data2) => {
    const output = fs.writeFile(
      "./txt/output.txt",
      `${data1}\n${data2}`,
      "utf8",
      (err) => {}
    );
    console.log("writing file...");
  });
});
const output = fs.writeFileSync("./txt/output.txt", file);
console.log("file written");
const test = fs.readFileSync("./txt/output.txt", "utf8");
console.log(`This is the output contents after writing the file: ${test}`);

//////////////////////////
// SERVER

// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/API") {
//     fs.readFile(`${__dirname} ./dev-data/data-json`, "utf8", (err, data) => {
//       const productData = JSON.parse(data);
//       res.writeHead(200, { "Content-type": "application/json" });
//   }
// });

//   if (pathName === "/overview") res.end("This is the overview");
// });

// server.listen(8080, "127.0.0.1", () => {
//   console.log("listening on port 8000...");
// });

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
app.get("/", (req, res) => {
  res.send("success!");
});

// OVERVIEW PAGE
app.get("/overview", (req, res) => {
  const cardsHtml = dataObj
    .map((card) => replaceTemplate(tempCard, card))
    .join("");

  const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
  res.end(output);
});

// PRODUCT PAGE
app.get("/product", (req, res) => {
  const product = dataObj[req.query.id];
  const output = replaceTemplate(tempProduct, product);
  res.end(output);
});

// API PAGE
app.get("/API", (req, res) => {
  res.sendFile(__dirname + "/dev-data/data.json");
});

app.listen(8090, (req, res) => {
  console.log("listening on port 8090...");
});
