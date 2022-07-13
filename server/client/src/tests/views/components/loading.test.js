import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Loading from '../../../views/components/loading'

test('render loading', () => {
    const text= "text-test"
    const aditional= "aditional-test"

    render(
        <Loading text={text} aditional={aditional}/> 
    );
    expect(screen.getByText(/text-test/i)).toBeInTheDocument();
    expect(screen.getByText(/aditional-test/i)).toBeInTheDocument();
});  
  