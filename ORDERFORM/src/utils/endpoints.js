import { envConfig } from "./config";

const baseUrl =
  envConfig.config === "LOCAL"
    ? envConfig.localUrl
    : envConfig.config === "PROD"
    ? envConfig.prodUrl
    : "";

export const LOGIN = `${baseUrl}login`;
export const EXECUTIVES = `${baseUrl}executives`;
export const ORDERS = `${baseUrl}orders`;
export const ADD_EXECUTIVE = `${baseUrl}add-executive`;
export const ADD_ADMIN = `${baseUrl}add-admin`;
export const ADD_DESIGNER = `${baseUrl}add-designer`;
export const ADD_ACCOUNT = `${baseUrl}add-account`;
export const SERVICE_EXECUTIVE = `${baseUrl}add-service-executive`;
export const SERVICE_MANAGER = `${baseUrl}add-service-manager`;
export const SALES_MANAGER = `${baseUrl}add-sales-manager`;
export const APPOINTMENTS = `${baseUrl}appointments`;
export const REQUIREMENTS = `${baseUrl}requirements`;
export const CHECK_CLIENT = `${baseUrl}check-client`;
export const UPI_NUMBERS = `${baseUrl}upi-numbers`;
export const SUBMIT = `${baseUrl}submit`;

