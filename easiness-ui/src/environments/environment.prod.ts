import { commonEnv } from "./environment.common";

const env = {
  production: true,
  environment: 'PROD',
  interceptAPICall: true,
  useIPC: true,
};

export const APP_CONFIG = { ...commonEnv, ...env };