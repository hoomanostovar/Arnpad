import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arnpad.synth',
  appName: 'Arnpad',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
