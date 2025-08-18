
export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?:string,
  updatedAt?: string
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
