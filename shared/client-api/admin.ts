import { Admin } from '@baseline/types/admin';
import { RequestHandler } from './request-handler';

export const getAllAdmins = async (
  requestHandler: RequestHandler,
): Promise<Admin[]> => {
  const response = await requestHandler.request<Admin[]>({
    method: 'GET',
    url: `admin/list`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const deleteAdmin = async (
  requestHandler: RequestHandler,
  data: { adminId: string },
): Promise<boolean> => {
  const response = await requestHandler.request<boolean>({
    method: 'DELETE',
    url: `admin/${data.adminId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const createAdmin = async (
  requestHandler: RequestHandler,
  data: { userEmail: string },
): Promise<Admin> => {
  const response = await requestHandler.request<Admin>({
    method: 'POST',
    url: `admin`,
    hasAuthentication: true,
    data,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const checkAdmin = async (
  requestHandler: RequestHandler,
): Promise<boolean> => {
  const response = await requestHandler.request<Admin>({
    method: 'GET',
    url: `admin`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return !!response.data.userSub;
  }
  return false;
};
