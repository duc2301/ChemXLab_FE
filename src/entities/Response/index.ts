export interface ResponseDTO<T> {
  message: string;
  isSuccess: boolean;
  result: T;
  errors: string[];
}
