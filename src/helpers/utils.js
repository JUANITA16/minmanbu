import { toast } from 'react-toastify';

export const setError = (error) => {
    if (error.request) {
        console.error(error.request);
        return {
            detail: "No se pudo generar el archivo, por favor comuníquese con el administrador."
        }
    }
    else if (error.response)
        console.log(error.response);
    else if (error.message)
        console.log(error.message);
}

export const setErrorTable = (error) => {
    if (error.request) {
        console.error(error.request);
        return {
            status:  error.response.status,
            detail: "No se pudo obtener los datos de la tabla"
        }
    }
    else if (error.response)
        console.log(error.response);
    else if (error.message)
        console.log(error.message);
}

export const setFormatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString("en-ES", { timeZone: 'America/Bogota' })
        .split("T")[0];
}

export const showToast = (message) => {
    toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
}

export function convertTZ(date) {
    return new Date((typeof date === "string"
        ? new Date(date)
        : date).toISOString("en-ES", { timeZone: 'America/Bogota' }));
}

//Si el parámetro days se envia en negativo se realiza una resta en los días
export function addDays(date, days) {
    date.setDate(date.getDate() + days)
    return date;
}