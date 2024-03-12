import serverless from 'serverless-http';
import { APIGatewayProxyEventBase } from 'aws-lambda';
import { Authorizer, RequestContext } from './request-context.type';
import { Application } from 'express';

const createAuthenticatedHandler = (app: Application) => {
  const handler = serverless(app, {
    request(
      request: RequestContext,
      event: APIGatewayProxyEventBase<Authorizer>,
    ) {
      request.context = event.requestContext;
      request.currentUserSub = `${request.context?.authorizer?.claims?.sub}`;
    },
  });
  return handler;
};

export default createAuthenticatedHandler;
