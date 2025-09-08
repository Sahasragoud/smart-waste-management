
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