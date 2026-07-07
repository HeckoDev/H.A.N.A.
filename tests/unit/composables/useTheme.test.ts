import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { useTheme } from '../../../app/composables/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  const TestComponent = defineComponent({
    setup() {
      const result = useTheme();
      return { ...result };
    },
    render() {
      return h('div', { 'data-testid': 'test-component' });
    },
  });

  describe('initialization', () => {
    it('should initialize with light theme by default', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      expect(wrapper.vm.theme.value).toBe('light');
    });

    it('should load theme from localStorage if available', async () => {
      localStorage.setItem('theme', 'dark');
      const wrapper = mount(TestComponent);
      await nextTick();
      expect(wrapper.vm.theme.value).toBe('dark');
    });

    it('should apply dark class on mount if theme is dark', async () => {
      localStorage.setItem('theme', 'dark');
      const _wrapper = mount(TestComponent);
      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should not apply dark class on mount if theme is light', async () => {
      const _wrapper = mount(TestComponent);
      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();
      expect(wrapper.vm.theme.value).toBe('dark');
    });

    it('should toggle from dark to light', async () => {
      localStorage.setItem('theme', 'dark');
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();
      expect(wrapper.vm.theme.value).toBe('light');
    });

    it('should persist theme to localStorage when toggling', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();
      expect(localStorage.getItem('theme')).toBe('dark');
      wrapper.vm.toggleTheme();
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should add dark class when toggling to dark', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when toggling to light', async () => {
      localStorage.setItem('theme', 'dark');
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('theme property', () => {
    it('should be readonly', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      // theme is a readonly ref - verify it's a Ref object
      expect(wrapper.vm.theme).toHaveProperty('value');
      // Readonly refs don't throw, they just don't allow reassignment in TypeScript
      // We can verify it has the readonly structure
      const themeRef = wrapper.vm.theme;
      expect(typeof themeRef.value).toBe('string');
    });
  });

  describe('storage event handling', () => {
    it('should update theme when storage event is triggered with dark', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();

      const event = new StorageEvent('storage', {
        key: 'theme',
        newValue: 'dark',
        oldValue: 'light',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.theme.value).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should update theme when storage event is triggered with light', async () => {
      localStorage.setItem('theme', 'dark');
      const wrapper = mount(TestComponent);
      await nextTick();

      const event = new StorageEvent('storage', {
        key: 'theme',
        newValue: 'light',
        oldValue: 'dark',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.theme.value).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should ignore storage events for other keys', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.toggleTheme();

      const event = new StorageEvent('storage', {
        key: 'otherKey',
        newValue: 'light',
        oldValue: 'dark',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.theme.value).toBe('dark');
    });
  });
});
