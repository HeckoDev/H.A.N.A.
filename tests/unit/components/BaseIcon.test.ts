import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseIcon from '../../../app/components/atoms/BaseIcon.vue';

describe('BaseIcon', () => {
  describe('rendering', () => {
    it('should render search icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('path').attributes('d')).toContain('M21 21l-4.35-4.35');
    });

    it('should render close icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'close' },
      });
      expect(wrapper.find('path').attributes('d')).toContain('M6 18L18 6');
    });

    it('should render sun icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'sun' },
      });
      expect(wrapper.find('path').attributes('d')).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
    });

    it('should render moon icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'moon' },
      });
      expect(wrapper.find('path').attributes('d')).toContain('M20.354 15.354A9 9 0 018.646');
    });

    it('should render chevron-left icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'chevron-left' },
      });
      expect(wrapper.find('path').attributes('d')).toBe('M15 19l-7-7 7-7');
    });

    it('should render chevron-right icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'chevron-right' },
      });
      expect(wrapper.find('path').attributes('d')).toBe('M9 5l7 7-7 7');
    });

    it('should render alert icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'alert' },
      });
      expect(wrapper.find('path').attributes('d')).toContain('M12 9v2m0 4h.01m-6.938');
    });

    it('should render check icon', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'check' },
      });
      expect(wrapper.find('path').attributes('d')).toBe('M5 13l4 4L19 7');
    });
  });

  describe('sizes', () => {
    it('should apply small size class by default when size is sm', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search', size: 'sm' },
      });
      expect(wrapper.find('svg').classes()).toContain('w-4');
      expect(wrapper.find('svg').classes()).toContain('h-4');
    });

    it('should apply medium size class by default', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').classes()).toContain('w-5');
      expect(wrapper.find('svg').classes()).toContain('h-5');
    });

    it('should apply large size class when specified', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search', size: 'lg' },
      });
      expect(wrapper.find('svg').classes()).toContain('w-6');
      expect(wrapper.find('svg').classes()).toContain('h-6');
    });
  });

  describe('accessibility', () => {
    it('should be aria-hidden when no ariaLabel is provided', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');
      expect(wrapper.find('svg').attributes('role')).toBeUndefined();
    });

    it('should have aria-label when provided', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search', ariaLabel: 'Search icon' },
      });
      expect(wrapper.find('svg').attributes('aria-label')).toBe('Search icon');
      expect(wrapper.find('svg').attributes('aria-hidden')).toBeUndefined();
    });

    it('should have role="img" when ariaLabel is provided', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search', ariaLabel: 'Search icon' },
      });
      expect(wrapper.find('svg').attributes('role')).toBe('img');
    });
  });

  describe('svg attributes', () => {
    it('should have correct svg namespace', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should have correct viewBox', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 24 24');
    });

    it('should have stroke properties', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('svg').attributes('stroke')).toBe('currentColor');
      expect(wrapper.find('svg').attributes('stroke-width')).toBe('2');
      expect(wrapper.find('svg').attributes('fill')).toBe('none');
    });

    it('should have rounded path properties', () => {
      const wrapper = mount(BaseIcon, {
        props: { name: 'search' },
      });
      expect(wrapper.find('path').attributes('stroke-linecap')).toBe('round');
      expect(wrapper.find('path').attributes('stroke-linejoin')).toBe('round');
    });
  });
});
