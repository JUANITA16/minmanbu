import "@testing-library/jest-dom";
import {setError, setFormatDate, convertTZ, addDays} from '../../helpers/utils'

describe('utils', () => {
    test('test setError without error message', () => {
        const msg= "Message-test"
        const error= {
            status:400,
            data:{
                message: "Data-msg-test"
            }
        }
    
        const expected = {
            status:  400,
            detail: "Message-test \n Motivo: Data-msg-test"
        }
        
        const result = setError(msg,error)
    
    
        expect(result).toEqual(expected);
    
    });  
      
    
    test('test setError without data message', () => {
        const msg= "Message-test"
        const error= {
            status:400,
            data:{
                error: "Data-error-test"
            }
        }
    
        const expected = {
            status:  400,
            detail: "Message-test \n Motivo: Data-error-test"
        }
        
        const result = setError(msg,error)
    
    
        expect(result).toEqual(expected);
    
    });  
      
    
    
    test('test convertTZ', () => {
        const date= '05/05/2022'
        
        const expected = new Date('05/05/2022')
    
        const result = convertTZ(date)
    
    
        expect(result).toEqual(expected);
    
    });  
      
    
    
    
    test('test setFormatDate', () => {
        const date= convertTZ('05/05/2022')
        
        const expected = '2022-05-05'
    
        const result = setFormatDate(date)
    
        expect(result).toEqual(expected);
    
    });  
      
    
    
    
    test('test addDays', () => {
        const date= new Date('05/07/2022')
        const days = -2
        
        const expected = new Date('05/05/2022')
    
        const result = addDays(date,days)
    
        expect(result).toEqual(expected);
    
    });  
})