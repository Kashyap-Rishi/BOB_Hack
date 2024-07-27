// config.ts
export const STORAGE_ACCOUNT_URL = import.meta.env.VITE_STORAGE_ACCOUNT_URL;

export const SAS_TOKENS = {
  financialData: import.meta.env.VITE_FINANCIAL_DATA_SAS_TOKEN,
  customerData: import.meta.env.VITE_CUSTOMER_DATA_SAS_TOKEN,
  transactionData: import.meta.env.VITE_TRANSACTION_DATA_SAS_TOKEN,
  loanData: import.meta.env.VITE_LOAN_DATA_SAS_TOKEN,
  fraudData: import.meta.env.VITE_FRAUD_DATA_SAS_TOKEN
};
