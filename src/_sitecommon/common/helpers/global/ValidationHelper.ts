/* eslint-disable */

import { toast } from 'react-toastify';


export const stringIsNullOrWhiteSpace = (str: any) => {
    if (str == null || str == undefined || str == "undefined") {
        return true;
    }
    
    if (!isNaN(parseFloat(str))) {
        str = str.toString();
    }

    return (!str || str?.trim() === '');
}


export const showSuccessMsg = (message: string) => {
    toast.success(message);
}


export const showErrorMsg = (message: string) => {
    
   toast.error(message);
  
}

export const showInfoMsg = (message: string) => {
    toast.info(message);
}

export const showWarningMsg = (message: string) => {
    toast.warn(message);
}
