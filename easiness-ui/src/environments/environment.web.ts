import { commonEnv } from "./environment.common";

const env = {
  production: false,
  environment: 'WEB',
  useIPC: false
};

export const APP_CONFIG = { ...commonEnv, ...env };
