
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
  timestamp: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: string;
  requestId?: string;
}
