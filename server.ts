import express from "express";

const app = express();
const port = 3000;

app.use(express.static("dist"));

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
