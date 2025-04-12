import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeCalculator from './TimeCalculator';
import SubtractHours from './SubtractHours';

describe('Logic Tests', () => {
  test('TimeCalculator calculates remaining time correctly', () => {
    render(<TimeCalculator />);

    const input = screen.getByLabelText(/datetime-local/i);
    const button = screen.getByText(/calcular tiempo restante/i);

    // Set a target date 2 hours from now
    const now = new Date();
    const targetDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const targetDateString = targetDate.toISOString().slice(0, 16);

    fireEvent.change(input, { target: { value: targetDateString } });
    fireEvent.click(button);

    expect(screen.getByText(/2 horas/i)).toBeInTheDocument();
  });

  test('SubtractHours adjusts time correctly', () => {
    const mockOnSubtract = jest.fn();
    render(<SubtractHours onSubtract={mockOnSubtract} />);

    const input = screen.getByPlaceholderText(/horas a restar/i);
    const button = screen.getByText(/restar horas/i);

    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.click(button);

    expect(mockOnSubtract).toHaveBeenCalledWith(3);
  });
});