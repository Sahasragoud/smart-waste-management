import API from "./api";
import type {RegisterRequest, User} from "../types/user";
import type { UpdateProfile } from "../types/updateProfile";
import type {UpdatePassword} from '../types/updatePassword'
// import type { UserFormData } from "../pages_admin/AdminUserModel";

export const loginUser = (email: string, password: string) => API.post("auth/login", {email:email, password:password});
export const registerUser = (userData : RegisterRequest)=> API.post("auth/register",userData);
export const resetPassword = (token :string, newPassword: string) => API.post<string>(`/users/reset-password?token=${token}`,newPassword);
export const updatePassword = (userId: number,updateFields : UpdatePassword)=> API.put(`users/${userId}/updatePassword`,updateFields);
export const updateProfile = (userId : number, updateFields : Partial<UpdateProfile>) => API.put(`users/${userId}/updateProfile`, updateFields);
export const getUser = (userId : number) => API.get<User>(`users/by-id?id=${userId}`);
export const deleteUser = (userId : number) => API.delete(`admin/user/${userId}`);
export const getUsers = (
    page : number=0, 
    size : number = 9, 
    sortField : string ="id",
    sortDirection : string ="asc"
    ) => {
        return API.get(
            `admin/users?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`
        );
    }    

    // export const createUser = (userData : UserFormData) => API.post<UserFormData>(`admin/user/create`, userData);