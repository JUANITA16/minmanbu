import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import InputDate from '../../../views/components/inpput-date';
import {convertTZ} from '../../../helpers/utils';


describe('input-date', () => {
    test('render input-date without endDate', () => {
        const labelName = "Fecha inicial";
        const startDate = convertTZ(new Date());
        const setStartDate = jest.fn();
        render(
            <InputDate labelName={labelName}  setDate={setStartDate}  dateInput={startDate}  />
        );
        expect(screen.getByText(/Fecha inicial/i)).toBeInTheDocument();
    });


    test('render input-date with endDate', () => {
        const labelName = "Fecha inicial";
        const startDate = convertTZ(new Date());
        const endDate = convertTZ(new Date());
        const setStartDate = jest.fn();
        render(
            <InputDate labelName={labelName} maxValue={endDate} setDate={setStartDate}  dateInput={startDate}  />
        );

        expect(screen.getByText(/Fecha inicial/i)).toBeInTheDocument();
    });

});
