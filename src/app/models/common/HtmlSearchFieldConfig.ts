import { ReactElement } from "react";

export type HtmlSearchFieldConfig = {
    [x: string]: any;
    inputId: string;
    inputName: string;
    labelName?: string;
    placeHolder?: string;
    type: 'text' | 'number' | 'search' | 'dropdown' | 'date' | 'checkbox' | 'hidden';
    options?: { text: string; value: string }[];
    defaultValue?: string;
    iconClass?: string;
    icon?: ReactElement; // New field to represent a React icon component
  };