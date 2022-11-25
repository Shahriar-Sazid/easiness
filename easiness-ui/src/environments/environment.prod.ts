import { commonEnv } from "./environment.common";

const env = {
  production: true,
  environment: 'PROD',
  interceptAPICall: true,
};

export const APP_CONFIG = { ...commonEnv, ...env };