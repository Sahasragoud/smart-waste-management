import type { User } from '../types/user';
import API from './api';

export const createMember = (request : User) => {API.post(`admin/create`,request)};
export const getUsersByRole = (
    role : string = "users",
    page : number ,
    size : number,
    sortField : string,
    sortDirection :string
) => API.get(`admin/users/by-role=${role}?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`);

export const deleteUser = (userId : number) => API.delete(`admin/user/${userId}`);

export const getUploads = (
    page : number ,
    size : number,
    sortField : string,
    sortDirection :string
) => API.get(`admin/uploads?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`);

export const deleteUpload = (uploadId : number) => API.delete(`admin/upload/${uploadId}`);
