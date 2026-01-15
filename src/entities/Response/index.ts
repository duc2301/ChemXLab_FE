export interface ResponseDTO<T> {
  message: string;
  isSuccess: boolean;
  result: T;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
} 

