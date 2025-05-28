import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),

    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock environment variables
const env = {
  VITE_FIREBASE_API_KEY: "",
  VITE_FIREBASE_AUTH_DOMAIN: "",
  VITE_FIREBASE_PROJECT_ID: "",
  VITE_FIREBASE_STORAGE_BUCKET: "",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "",
  VITE_FIREBASE_APP_ID: "",
  VITE_FIREBASE_MEASUREMENT_ID: "",
  VITE_ENVIRONMENT: "test",
  VITE_SERVER_URL: "http://localhost:4000",
  VITE_REDIRECT_URL: "http://localhost:5173/auth",
};

Object.defineProperty(global, "import", {
  writable: true,
  value: {
    meta: {
      env,
    },
  },
});
