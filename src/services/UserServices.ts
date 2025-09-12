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


export const createUpload = (userId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/uploads/user/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

