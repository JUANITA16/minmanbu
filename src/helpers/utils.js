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

export const setFormatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
}

export const showToast = (message) => {
    toast.dark(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
}