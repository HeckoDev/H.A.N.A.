import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseSpinner from '../../../app/components/atoms/BaseSpinner.vue';

describe('BaseSpinner', () => {
  describe('rendering', () => {
    it('should render a spinner element', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    it('should have spinning animation class', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').classes()).toContain('animate-spin');
    });

    it('should be circular', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').classes()).toContain('rounded-full');
    });

    it('should render sr-only text', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('.sr-only').exists()).toBe(true);
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'sm' },
      });
      const spinner = wrapper.find('[role="status"]');
      expect(spinner.classes()).toContain('w-4');
      expect(spinner.classes()).toContain('h-4');
      expect(spinner.classes()).toContain('border-2');
    });

    it('should apply medium size classes by default', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');
      expect(spinner.classes()).toContain('w-6');
      expect(spinner.classes()).toContain('h-6');
      expect(spinner.classes()).toContain('border-2');
    });

    it('should apply large size classes', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'lg' },
      });
      const spinner = wrapper.find('[role="status"]');
      expect(spinner.classes()).toContain('w-8');
      expect(spinner.classes()).toContain('h-8');
      expect(spinner.classes()).toContain('border-3');
    });
  });

  describe('label', () => {
    it('should use default label', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').attributes('aria-label')).toBe('Chargement en cours...');
      expect(wrapper.find('.sr-only').text()).toBe('Chargement en cours...');
    });

    it('should accept custom label', () => {
      const wrapper = mount(BaseSpinner, {
        props: { label: 'Custom loading message' },
      });
      expect(wrapper.find('[role="status"]').attributes('aria-label')).toBe('Custom loading message');
      expect(wrapper.find('.sr-only').text()).toBe('Custom loading message');
    });

    it('should update sr-only text when label prop changes', async () => {
      const wrapper = mount(BaseSpinner, {
        props: { label: 'Initial' },
      });
      await wrapper.setProps({ label: 'Updated' });
      expect(wrapper.find('.sr-only').text()).toBe('Updated');
    });
  });

  describe('accessibility', () => {
    it('should have role="status"', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    it('should have aria-label attribute', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').attributes('aria-label')).toBeDefined();
    });

    it('should have screen reader only text', () => {
      const wrapper = mount(BaseSpinner);
      const srOnly = wrapper.find('.sr-only');
      expect(srOnly.exists()).toBe(true);
      expect(srOnly.text()).toBe('Chargement en cours...');
    });
  });

  describe('styling', () => {
    it('should have border styling classes', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');
      expect(spinner.classes()).toContain('border-current');
      expect(spinner.classes()).toContain('border-solid');
      expect(spinner.classes()).toContain('border-r-transparent');
    });

    it('should be inline-block', () => {
      const wrapper = mount(BaseSpinner);
      expect(wrapper.find('[role="status"]').classes()).toContain('inline-block');
    });
  });
});
