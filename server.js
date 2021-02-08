const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3002;

const API_KEY = "33bf591453faa0b245e51e5dc5cd068c";

app.use(cors());
app.get("/health", (req, res) => res.json({ status: "OK" }));

app.get("/getData", async (req, res) => {
  const { startDate, stocks } = req.query;
  const response = await fetch(
    `http://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${stocks}&date_from=${startDate}&limit=1000`
  ).catch((error) => res.send({ message: "error dupa", code: 500 }));

  const parsed = await response.json();
  const stockData = parsed.data;
  const aggregatedData = stocks.split(",");

  let rtn = {};

  // remove unnecessary properties from objects to make calculations faster
  const simplifiedStockData = stockData.map((el) => {
    const { close, symbol, ...rest } = el;
    return { close, symbol };
  });

  // aggregate average values per stock from 7 days period
  // assume that most important is close value for each day
  aggregatedData.forEach((stock) => {
    const dataPerStock = simplifiedStockData.filter(
      (el) => el.symbol === stock
    );

    const arr = [];
    let days = 0;
    let sum = 0;
    for (let i = 0; i < dataPerStock.length; i++) {
      sum += dataPerStock[i].close;
      days += 1;
      if (days === 7) {
        arr.push((sum / 7).toFixed(1));
        days = 0;
        sum = 0;
      }
    }
    rtn[stock] = arr;
  });

  return res.send(rtn);
});

app.listen(port, () => {
  console.log("RESTful API server started on: " + port);
});
