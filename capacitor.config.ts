import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elan.wellness',
  appName: 'ÉLAN',
  webDir: 'dist',
  server: {
    url: 'https://elan-frontend.vercel.app',
    cleartext: false
  }
};

export default config;