import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders initial balance, submit button and start date inputs", () => {
  render(<App />);
  const startDate = screen.getByLabelText("Start date:");
  const initialBalance = screen.getByLabelText("Initial balance:");
  const submitButton = screen.getByTestId("submit");

  expect(startDate).toBeInTheDocument();
  expect(initialBalance).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("check for value after submitting (without providing value) and shows error", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("submit"));

  const errorMessage = screen.getByText(
    "Please choose at least one stock from the dataset/dropdown list!"
  );
  expect(errorMessage).toBeInTheDocument();
});

test("add a new stock item when clicking on button", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("addStock"));

  const stocks = screen.getAllByTestId('stocks')
  expect(stocks).toHaveLength(2);
});
