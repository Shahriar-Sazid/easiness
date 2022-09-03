import { commonEnv } from "./environment.common";

const env = {
  production: false,
  environment: 'WEB',
};

export const APP_CONFIG = { ...commonEnv, ...env };
