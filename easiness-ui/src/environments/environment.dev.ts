import { commonEnv } from "./environment.common";

const env = {
  production: false,
  environment: 'DEV',
  interceptAPICall: false,
  useIPC: true,
};

export const APP_CONFIG = { ...commonEnv, ...env };