import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Auto-imports globaux pour Vue
global.ref = vi.fn(val => ({ value: val }));
global.computed = vi.fn(fn => ({ value: fn() }));
global.readonly = vi.fn(ref => ref);
global.onMounted = vi.fn();
global.onUnmounted = vi.fn();
global.watch = vi.fn();
global.watchEffect = vi.fn();
global.nextTick = vi.fn(() => Promise.resolve());

// Configuration Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key,
};

// Mock localStorage
global.localStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
  key: (index: number) => Object.keys(this.store)[index] || null,
  get length() {
    return Object.keys(this.store).length;
  },
};
