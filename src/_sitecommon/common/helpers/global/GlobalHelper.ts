
/* eslint-disable */


import { APP_BASIC_CONSTANTS } from "../../constants/Config";
import { orderStatusesConst } from "../../enums/GlobalEnums";


export const setBusnPartnerIdAndTokenInStorage = (busnPartnerId: any, jwtToken: string) => {
  localStorage.setItem('busnPartnerId', busnPartnerId ?? "");
  localStorage.setItem('Authorization', `${jwtToken ?? ""}`);
};


export const getBusnPartnerIdAndTokenFromStorage = () => {
  let busnPartnerId = localStorage.getItem('busnPartnerId');
  let jwtToken = localStorage.getItem('Authorization');
  let result = {
    busnPartnerId: busnPartnerId,
    jwtToken: jwtToken
  }
  return result;
};

export const removeKeywordIfPresentAtEnd = (str: string, keyword: string) => {
  
  if (keyword && str?.trim()?.toLocaleLowerCase()?.endsWith(keyword?.trim()?.toLocaleLowerCase())) {
      const keywordLength = keyword.length;
      return str?.trim()?.slice(0, -keywordLength); 
  } else {
      return str; // If the keyword is not present at the end, return the string unchanged
  }
}

export const buildUrlParamsForSearch = (dataArray: any) => {
  const urlParams = new URLSearchParams();

  // Iterate through each object in the array
  dataArray.forEach((obj: { inputName: any; defaultValue: any; }) => {
    // Extract field name and its value from each object
    const { inputName, defaultValue } = obj;

    // Check if the inputName ends with 'search' and if it's the only text at the end
    const sanitizedInputName = removeKeywordIfPresentAtEnd(inputName, 'search');

    // Add field name and value to URL parameters
    urlParams.append(sanitizedInputName, defaultValue == '-999' ? '' : defaultValue);
  });

  // Convert URL parameters to string
  return urlParams.toString();
}

export const GetDefaultCurrencySymbol = () => {
  let DefaultCurrencySymbol = "$";  //--USD is consider as default if there is no setting in appsetting.json file
  DefaultCurrencySymbol = APP_BASIC_CONSTANTS.DefaultCurrencySymbol ?? "$";
  return DefaultCurrencySymbol;


}

export const  getOrderStatusClass = (statusId: number) => {
  switch (statusId) {
      case orderStatusesConst.Completed:
          return 'badge badge-light-success';
      case orderStatusesConst.InProgress:
          return 'badge badge-light-warning';
      case orderStatusesConst.Active:
          return 'badge badge-light-danger';
      case orderStatusesConst.Cancelled:
          return 'badge badge-light-info';
      case orderStatusesConst.Returned:
          return 'badge badge-light-primary';
      case orderStatusesConst.Refuned:
          return 'badge badge-light-primary';
      default:
          return 'badge badge-light-info'; // Return an empty string or a default class if needed
  }
}

export const  getOrderDetailStatusBoundaryClass = (statusId: number) => {
  switch (statusId) {
      case orderStatusesConst.Completed:
          return 'bullet bullet-vertical h-20px bg-success';
      case orderStatusesConst.InProgress:
          return 'bullet bullet-vertical h-20px bg-warning';
      case orderStatusesConst.Active:
          return 'bullet bullet-vertical h-20px bg-danger';
      case orderStatusesConst.Cancelled:
          return 'bullet bullet-vertical h-20px bg-info';
      case orderStatusesConst.Returned:
          return 'bullet bullet-vertical h-20px bg-primary';
      case orderStatusesConst.Refuned:
          return 'bullet bullet-vertical h-20px bg-primary';
      default:
          return 'bullet bullet-vertical h-20px bg-primary'; // Return an empty string or a default class if needed
  }
}


