import { commonEnv } from "./environment.common";

const env = {
  production: false,
  environment: 'DEV',
};

export const APP_CONFIG = { ...commonEnv, ...env };