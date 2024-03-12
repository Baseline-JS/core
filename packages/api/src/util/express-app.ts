import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import { logRoute } from '../middleware/log-route';

const createApp = (): Application => {
  const corsOptions = {
    origin: process.env.API_CORS_ORIGIN,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(compression());
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(logRoute);
  return app;
};

export default createApp;
