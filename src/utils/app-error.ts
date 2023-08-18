
export class AppError extends Error {
  statusCode: any;
  status: any;
  isOperational: boolean;
  statusText: string;
  constructor(message: string, statusCode: number, statusText: string) {
    super(message);
    this.statusText = statusText;
    this.statusCode = statusCode;
    this.status = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
