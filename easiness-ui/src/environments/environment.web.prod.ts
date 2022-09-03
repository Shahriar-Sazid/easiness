import { commonEnv } from "./environment.common";

const env = {
  production: true,
  environment: 'WEB-PROD',
};

export const APP_CONFIG = { ...commonEnv, ...env };
