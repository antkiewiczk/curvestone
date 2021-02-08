import React, { useState, useEffect } from "react";

import Graph from "./components/Graph";
import Spinner from "./components/Spinner";
import "./App.scss";

import NASDAQ_SYMBOLS_URL from "./constants";

function App() {
  const [symbols, setSymbols] = useState([]);
  const [startDate, setStartDate] = useState("2020-07-01");
  const [balance, setBalance] = useState(1000);
  const [stockAllocation, setStockAllocation] = useState([
    { symbol: "", percentage: 100 },
  ]);
  const [aggregated, setAggregated] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    getSymbols();
  }, []);

  useEffect(() => {
    prepareGraphData();
  }, [aggregated]);

  function prepareGraphData() {
    const toUpdate = [];
    aggregated &&
      Object.keys(aggregated).forEach((key) => {
        toUpdate.push({
          chart: {
            type: "spline",
          },
          title: {
            text: `Average weekly data for ${key}`,
          },
          series: [
            {
              name: key,
              data: aggregated[key].map((el) => parseInt(el)),
            },
          ],
        });
      });
    setGraphData(toUpdate);
    setIsLoading(false);
  }

  async function getSymbols() {
    const response = await fetch(NASDAQ_SYMBOLS_URL);
    const data = await response.json();
    const symbols = data.map((el) => el.Symbol);
    setSymbols(symbols);
  }

  function addStock(e) {
    e.preventDefault();
    setStockAllocation([...stockAllocation, { symbol: "", percentage: 0 }]);
  }

  function updateStock(e, index) {
    e.preventDefault();
    const { name, value } = e.target;

    const newStockAllocations = [...stockAllocation];
    newStockAllocations[index][name] = value;
    setStockAllocation(newStockAllocations);
  }

  async function submitForm(e) {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setIsLoading(true);

    const stocks = stockAllocation.map((allocation) => allocation.symbol);
    const queryString = `?startDate=${startDate}&stocks=${stocks.join(",")}`;
    const rtn = await fetch(`http://localhost:3002/getData${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const parsed = await rtn.json();
    if (parsed.code === 500) {
      setIsLoading(false);
      setServerError(
        "There was an error processing your request. Please reload the page and try again"
      );
      return;
    }
    setAggregated(parsed);
  }

  function validateForm() {
    let isSymbolEmpty = false;
    stockAllocation.forEach((stock) => {
      if (stock.symbol === "") {
        isSymbolEmpty = true;
      }
    });
    if (isSymbolEmpty) {
      return "Please choose at least one stock from the dataset/dropdown list!";
    }

    const totalPercentage = stockAllocation.reduce(
      (acc, el) => (acc += parseInt(el.percentage)),
      0
    );
    if (totalPercentage !== 100) {
      return "Please make sure that the percentages add up to 100!";
    }
  }

  function calculatePortfolioValue() {
    const factors = [];
    Object.keys(aggregated).forEach((stock) => {
      // difference between current stock value and old stock value
      const factor =
        parseInt(aggregated[stock][aggregated[stock].length - 1]) /
        parseInt(aggregated[stock][0]);
      // weight - percentage of portfolio allocation
      const weight = stockAllocation.find((el) => el.symbol === stock)
        .percentage;
      const weightedValue = factor * weight;
      factors.push(weightedValue);
    });

    const totalFactor =
      factors.reduce((acc, el) => (acc += el)) / factors.length;
    return ((totalFactor * balance) / 100).toFixed(2);
  }

  if (serverError) {
    return (
      <div className="App">
        <h2>{serverError}</h2>
      </div>
    );
  }

  return (
    <div className="App">
      {graphData.length ? (
        <div>
          <p>
            If you invested on a given portfolio {balance}$ on{" "}
            {startDate.substr(0, 10)}, your portfolio would now be worth{" "}
            {calculatePortfolioValue()}$
          </p>
          <Graph graphData={graphData} />
        </div>
      ) : (
        <div>
          <form>
            <label htmlFor="startDate">Start date:</label>
            <br />
            <input
              type="date"
              id="startDate"
              name="startDate"
              placeholder="Start date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            <br />
            <br />
            <label htmlFor="initialBalance">Initial balance:</label>
            <br />
            <input
              type="number"
              id="initialBalance"
              name="initialBalance"
              placeholder="Initial balance"
              onChange={(e) => setBalance(e.target.value)}
              value={balance}
            />
            $
            <br />
            <br />
            Your stock allocation: <br />
            {stockAllocation.map((el, index) => {
              return (
                <div key={index} className="stocks" data-testid="stocks">
                  <input
                    list="stocks"
                    name="symbol"
                    value={el.symbol || ""}
                    onChange={(e) => updateStock(e, index)}
                  />
                  <datalist id="stocks">
                    {symbols.map((symbol) => (
                      <option value={symbol} key={symbol} />
                    ))}
                  </datalist>
                  <input
                    type="number"
                    name="percentage"
                    placeholder="%"
                    value={el.percentage || 0}
                    max={100}
                    min={0}
                    onChange={(e) => updateStock(e, index)}
                    className="percentage"
                  />{" "}
                  %
                </div>
              );
            })}
            <button type="submit" data-testid="submit" onClick={(e) => submitForm(e)}>
              Submit
            </button>
            <button onClick={(e) => addStock(e)} data-testid="addStock">Add portfolio item +</button>
          </form>
        </div>
      )}

      {isLoading && <Spinner />}

      {validationError && (
        <div className="validationError">{validationError}</div>
      )}
    </div>
  );
}

export default App;
