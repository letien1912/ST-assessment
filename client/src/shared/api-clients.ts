import axios from 'axios';
import qs from 'qs';
import { GetUsers, UsersResponse } from './types/get-users';

const createApi = () => {
  const apiInstance = axios.create({
    paramsSerializer: (params: unknown) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
    baseURL: 'http://localhost:3000',
  });

  return {
    get: {
      fetchUsers: (params: GetUsers) =>
        apiInstance.get<UsersResponse>('/users', { params }),
    },
    post: {
      uploadFile: (file: Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiInstance.post('/users/upload', formData);
      },
    },
  };
};

export const apiClient = createApi();
