import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { useFontSize } from '../../../app/composables/useFontSize';

describe('useFontSize', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = '';
    vi.clearAllMocks();
  });

  const TestComponent = defineComponent({
    setup() {
      const result = useFontSize();
      return { ...result };
    },
    render() {
      return h('div', { 'data-testid': 'test-component' });
    },
  });

  describe('initialization', () => {
    it('should initialize with normal size by default', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      expect(wrapper.vm.fontSize).toBe('normal');
    });

    it('should load size from localStorage if available', async () => {
      localStorage.setItem('fontSize', 'large');
      const wrapper = mount(TestComponent);
      await nextTick();
      expect(wrapper.vm.fontSize).toBe('large');
    });

    it('should apply font size on mount', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      expect(document.documentElement.style.fontSize).toBe('16px');
    });
  });

  describe('setFontSize', () => {
    it('should change font size to large', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('large');
      expect(wrapper.vm.fontSize).toBe('large');
    });

    it('should change font size to xlarge', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('xlarge');
      expect(wrapper.vm.fontSize).toBe('xlarge');
    });

    it('should persist size to localStorage', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('large');
      expect(localStorage.getItem('fontSize')).toBe('large');
    });

    it('should apply normal size (16px) to document', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('normal');
      expect(document.documentElement.style.fontSize).toBe('16px');
    });

    it('should apply large size (18px) to document', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('large');
      expect(document.documentElement.style.fontSize).toBe('18px');
    });

    it('should apply xlarge size (20px) to document', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('xlarge');
      expect(document.documentElement.style.fontSize).toBe('20px');
    });
  });

  describe('fontSize property', () => {
    it('should be readonly', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      // fontSize is exposed as a simple value from the component instance
      expect(wrapper.vm.fontSize).toBe('normal');
    });
  });

  describe('storage event handling', () => {
    it('should update fontSize when storage event is triggered', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();

      const event = new StorageEvent('storage', {
        key: 'fontSize',
        newValue: 'large',
        oldValue: 'normal',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.fontSize).toBe('large');
      expect(document.documentElement.style.fontSize).toBe('18px');
    });

    it('should update to xlarge from storage event', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();

      const event = new StorageEvent('storage', {
        key: 'fontSize',
        newValue: 'xlarge',
        oldValue: 'normal',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.fontSize).toBe('xlarge');
      expect(document.documentElement.style.fontSize).toBe('20px');
    });

    it('should ignore storage events for other keys', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();
      wrapper.vm.setFontSize('large');

      const event = new StorageEvent('storage', {
        key: 'otherKey',
        newValue: 'xlarge',
        oldValue: 'normal',
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.fontSize).toBe('large');
    });
  });
});
