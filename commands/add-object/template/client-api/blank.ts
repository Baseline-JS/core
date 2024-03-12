import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';
import { RequestHandler } from './request-handler';

export const get{{ nameFirst }} = async (requestHandler: RequestHandler, {{ nameCamel }}Id: string): Promise<{{ nameFirst }}> => {
  const response = await requestHandler.request<{{ nameFirst }}>({
    method: 'GET',
    url: `{{ nameKebab }}/${{{ nameCamel }}Id}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const getAll{{ nameFirst }}s = async (requestHandler: RequestHandler): Promise<{{ nameFirst }}[]> => {
  const response = await requestHandler.request<{{ nameFirst }}[]>({
    method: 'GET',
    url: `{{ nameKebab }}/list`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const delete{{ nameFirst }} = async (requestHandler: RequestHandler, {{ nameCamel }}Id: string): Promise<boolean> => {
  const response = await requestHandler.request<boolean>({
    method: 'DELETE',
    url: `{{ nameKebab }}/${{{ nameCamel }}Id}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const create{{ nameFirst }} = async (
  requestHandler: RequestHandler,
  {{ nameCamel }}: Partial<{{ nameFirst }}>,
): Promise<{{ nameFirst }}> => {
  const response = await requestHandler.request<{{ nameFirst }}>({
    method: 'POST',
    url: `{{ nameKebab }}`,
    hasAuthentication: true,
    data: {{ nameCamel }},
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const update{{ nameFirst }} = async (
  requestHandler: RequestHandler,
  {{ nameCamel }}: Partial<{{ nameFirst }}>,
): Promise<{{ nameFirst }}> => {
  const response = await requestHandler.request<{{ nameFirst }}>({
    method: 'PATCH',
    url: `{{ nameKebab }}`,
    hasAuthentication: true,
    data: {{ nameCamel }},
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};
