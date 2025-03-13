import React from "react"
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AppFunctional from "./AppFunctional"

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test('renders headings, buttons, and input field', () => {
  render(<AppFunctional />);

  // checking the headings
  expect(screen.getByText(/coordinates/i)).toBeInTheDocument();
  expect(screen.getByText(/you moved/i)).toBeInTheDocument();

  // checking the buttons
  expect(screen.getByText(/left/i)).toBeInTheDocument();
  expect(screen.getByText(/right/i)).toBeInTheDocument();
  expect(screen.getByText(/up/i)).toBeInTheDocument();
  expect(screen.getByText(/down/i)).toBeInTheDocument();
  expect(screen.getByText(/reset/i)).toBeInTheDocument();

  expect(screen.getByPlaceholderText(/type email/i)).toBeInTheDocument();
});

test('typing in email input updates the value', () => {
  render(<AppFunctional />);

  const emailInput = screen.getByPlaceholderText(/type email/i);

  //typing
  fireEvent.change(emailInput, {target: {value: 'test@example.com'}}); 

  //expect the value change
  expect(emailInput.value).toBe('test@example.com')
});

test('pressing movement buttons updates the coordinates', () => {
  render(<AppFunctional />);

  const up = screen.getByText(/up/i);
  const coords = screen.getByText(/coordinates/i);
  const initialCoords = coords.textContent;

  fireEvent.click(up);

  expect(coords.textContent).not.toBe(initialCoords);
}); 

test('submitting valid email displays success message', () => {
  render(<AppFunctional />);

  const emailRes = screen.getByPlaceholderText(/type email/i);
  const submit = screen.getByRole('button', {name:/submit/i});

  fireEvent.change(emailRes, {target: {value: 'test@example.com'}});
  fireEvent.click(submit);

  waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  })
});

test('reset button resets coords and steps', () => {
  render(<AppFunctional />); 

  const reset = screen.getByRole('button', {name: /reset/i});
  const countSteps = screen.getByText(/you moved/i);
  const coords = screen.getByText(/coordinates/i);

  fireEvent.click(screen.getByText(/up/i));

  expect(countSteps.textContent).not.toBe('You moved 0 times');
  expect(coords.textContent).not.toBe('Coordinates (2, 2)');

  fireEvent.click(reset);

  expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
  expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
});


