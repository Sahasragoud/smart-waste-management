
export type User = {
    id:number;
    username:string;
    email:string;
    password:string;
    phoneNumber:string;
    address:string;
    createdDate:string;
    dateOfBirth:string;
    points:number;
    role: "USER" | "ADMIN";
}

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  role: "USER" | "ADMIN";
};