import "@testing-library/jest-dom";
import {setError, setFormatDate, convertTZ, addDays,convertMessageError} from '../../helpers/utils'

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
    
    test('test convertMessageError ok', () => {
        const message = "[{'status_code':404, 'update_rate_content': 'Error - Invalid account id or encoded key'}, {'status_code': 404, 'state_content': 'Error - INVALID_DEPOSIT_ACCOUNT_ID'}, {'status_code': 404, 'tax_content': 'Error - Invalid account id or encoded key'}, {'status_code': 404, 'iva_content': 'Error - INVALID_DEPOSIT_ACCOUNT_ID'}, {'status_code': 404, 'gmf_content': 'Error - INVALID_DEPOSIT_ACCOUNT_ID'}, {'status_code': 404, 'less_content': 'Error - INVALID_DEPOSIT_ACCOUNT_ID'}, {'status_code': 404, 'max_withdrawal_content': 'Error - INVALID_DEPOSIT_ACCOUNT_ID'}]"
        
        const expected = [
            'Error en Tasa de Interés: Invalid account id or encoded key',
            'Error en Estado Cuenta: INVALID_DEPOSIT_ACCOUNT_ID',
            'Error en Impuesto Retención: Invalid account id or encoded key',
            'Error en Exento Iva: INVALID_DEPOSIT_ACCOUNT_ID',
            'Error en Exento GMF: INVALID_DEPOSIT_ACCOUNT_ID',
            'Error en Consecutivo Less: INVALID_DEPOSIT_ACCOUNT_ID',
            'Error en Monto máximo de retiro: INVALID_DEPOSIT_ACCOUNT_ID'
        ]
    
        const result = convertMessageError(message)
    
        expect(result).toEqual(expected);
    
    }); 
    
    test('test convertMessageError 500', () => {
        const message = "[{'status_code':500, 'message': 'Error actualizando los datos: Fatal Error'}]"        
        const expected = [
            'Error actualizando los datos: Fatal Error'
        ]
    
        const result = convertMessageError(message)
    
        expect(result).toEqual(expected);
    
    }); 
    
    test('test convertMessageError catch', () => {
        const message = 'Mensaje con errores'
        const expected = [
            'Mensaje con errores'
        ]
    
        const result = convertMessageError(message)
    
        expect(result).toEqual(expected);
    
    }); 
})