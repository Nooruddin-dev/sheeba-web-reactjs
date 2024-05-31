/* eslint-disable */
import { format, differenceInCalendarDays } from 'date-fns';
import { stringIsNullOrWhiteSpace } from './ValidationHelper';

export const makeAnyStringShortAppenDots = (inputString: string, length: number) => {

  length = length ?? 50;

  if (inputString != undefined && inputString != null && inputString.length > 0) {
    const newString = inputString.length > length ? (inputString.substring(0, length) + '...') : (inputString.substring(0, length))
    return newString;
  } else {
    return "";
  }

}

export const calculatePriceDiscountPercentage = (originalPrice: any, discountedPrice: any) => {

  
  const discount = (originalPrice ?? 0) - (discountedPrice ?? 0);
  const discountPercentage = (discount / originalPrice) * 100;
  return discountPercentage.toFixed(2) + "%";
}

export const generateSimpleRandomPassword = (length: number) => {
  // Define a smaller set of characters for password generation
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Initialize the password as an empty string
  let password = '';

  // Generate the password by randomly selecting characters from the defined set
  for (let i = 0; i < length; i++) {
    // Get a random index within the range of available characters
    const randomIndex = Math.floor(Math.random() * characters.length);

    // Append the character at the random index to the password
    password += characters[randomIndex];
  }

  return password; // Return the generated password
}

export const getDateCommonFormatFromJsonDate = (dateString: string, returnTime: boolean = false) => {

  if (stringIsNullOrWhiteSpace(dateString) == true) {
    return '';
  }

  // Create a Date object from the date string
  const date = new Date(dateString);

  // Define an array of month names
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Extract the day, month, and year from the Date object
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract the hours, minutes, and seconds from the Date object
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Return the formatted date string
  if (returnTime == true) {
    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds}`;
  } else {
    return `${day} ${month}, ${year}`;
  }

}

export const createOrderStatusOptionsForDropDown = (allOrdersStatuses: any) => {
  const options = [];

  // Add the default option
  options.push({ text: 'Select status', value: '-999' });

  // Iterate over the array of objects
  allOrdersStatuses.forEach((obj: any) => {
    options.push({ text: obj.statusName, value: obj.statusId });
  });

  return options;
}

export const createShiftCashTransactionTypesForDropDown = (allShiftCashTransactionTypes: any) => {
  const options = [];

  // Add the default option
  options.push({ text: 'Select status', value: '-999' });

  // Iterate over the array of objects
  allShiftCashTransactionTypes.forEach((obj: any) => {
    options.push({ text: obj.cashTransactionTypeName, value: obj.cashTransactionTypeId });
  });

  return options;
}

export const valueRoundToDecimalPlaces = (num: number, decimalPlaces: number = 2): number => {
  if (isNaN(num)) {
    console.error('Invalid number format: ', 'Input must be a valid number');
    return num;
  }

  
  num = num ?? 0;
  decimalPlaces = decimalPlaces ?? 2;
  return parseFloat(num.toFixed(decimalPlaces));
};


export const getMonthName = (monthNumber: number) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (monthNumber < 1 || monthNumber > 12) {
    console.log("Month ID must be between 1 and 12.")
    return monthNames[1]
  }



  return monthNames[monthNumber - 1];
}


export const getTimeSlotFromCreateOnDate = (dateTimeString: string) => {

  // Parse it into a Date object
  const date = new Date(dateTimeString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format them to ensure two digits
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const finalTime = `${formattedHours}:${formattedMinutes}`;
  return finalTime;
}

export const getDaysDiffFromAnyDate = (dateTimeString: string) => {
  // Parse the date-time string into a Date object
  const date = new Date(dateTimeString);
  const now = new Date();

  // Calculate the difference in days between today and the provided date
  const daysDifference = differenceInCalendarDays(now, date);

  // Extract hours and minutes for formatting
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours and minutes to ensure two digits
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const timePart = `${formattedHours}:${formattedMinutes}`;

  // Determine the relative time description
  let relativeTime: string;
  if (daysDifference === 0) {
    relativeTime = `Today`;
  } else if (daysDifference === 1) {
    relativeTime = `1 day ago`;
  } else {
    relativeTime = `${daysDifference} days ago`;
  }

  // Return the combined formatted relative time and time slot
  return `${relativeTime}`;
};