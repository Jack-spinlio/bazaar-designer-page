
/// <reference types="vite/client" />

import * as THREE from 'three';

declare global {
  interface Window {
    THREE: typeof THREE;
  }
}
