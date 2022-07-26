import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import CardHeader from '../../../views/components/card-header'

test('render card-header', () => {
    const title = "title-test"
    const description = "description-test"
    render(
        <CardHeader title={title} description={description}/> 
    );
    expect(screen.getByText(/title-test/i)).toBeInTheDocument();
    expect(screen.getByText(/description-test/i)).toBeInTheDocument();
});  
  