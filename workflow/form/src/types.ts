
// Type definitions for form data and schema
export interface FormData {
    from: string;
    to: string;
    amount: number;
    contractFileHash: string;
    [key: string]: any; // Allow for additional properties
  }
  