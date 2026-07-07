import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import ErrorBanner from '../../../app/components/organisms/ErrorBanner.vue';
import BaseButton from '../../../app/components/atoms/BaseButton.vue';
import BaseIcon from '../../../app/components/atoms/BaseIcon.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {},
  },
});

const mountOptions = {
  global: {
    plugins: [i18n],
    stubs: {
      BaseButton: false,
      BaseIcon: false,
    },
  },
};

describe('ErrorBanner', () => {
  describe('rendering', () => {
    it('should render error message', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Test error message' },
        ...mountOptions,
      });
      expect(wrapper.text()).toContain('Test error message');
    });

    it('should render alert icon', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const icon = wrapper.findComponent(BaseIcon);
      expect(icon.exists()).toBe(true);
      expect(icon.props('name')).toBe('alert');
    });

    it('should render dismiss button by default', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
    });

    it('should not render dismiss button when dismissible is false', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error', dismissible: false },
        ...mountOptions,
      });
      expect(wrapper.findComponent(BaseButton).exists()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have role="alert"', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it('should have aria-hidden on alert icon', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const alertIcon = wrapper.findAllComponents(BaseIcon)[0];
      expect(alertIcon.attributes('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden on close icon', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error', dismissible: true },
        ...mountOptions,
      });
      const icons = wrapper.findAllComponents(BaseIcon);
      const closeIcon = icons[icons.length - 1];
      expect(closeIcon.attributes('aria-hidden')).toBe('true');
    });
  });

  describe('interactions', () => {
    it('should emit dismiss event when close button is clicked', async () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error', dismissible: true },
        ...mountOptions,
      });
      await wrapper.findComponent(BaseButton).trigger('click');
      expect(wrapper.emitted('dismiss')).toHaveLength(1);
    });

    it('should not emit dismiss when dismissible is false', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error', dismissible: false },
        ...mountOptions,
      });
      expect(wrapper.emitted('dismiss')).toBeUndefined();
    });
  });

  describe('styling', () => {
    it('should have red border and background', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const alertDiv = wrapper.find('[role="alert"]');
      expect(alertDiv.classes()).toContain('border-red-600');
      expect(alertDiv.classes()).toContain('bg-red-50');
    });

    it('should have rounded corners', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const alertDiv = wrapper.find('[role="alert"]');
      expect(alertDiv.classes()).toContain('rounded-lg');
    });

    it('should have padding', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const alertDiv = wrapper.find('[role="alert"]');
      expect(alertDiv.classes()).toContain('p-4');
    });

    it('should have gap between elements', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Error' },
        ...mountOptions,
      });
      const alertDiv = wrapper.find('[role="alert"]');
      expect(alertDiv.classes()).toContain('gap-4');
    });
  });

  describe('message display', () => {
    it('should display message with correct styling', () => {
      const wrapper = mount(ErrorBanner, {
        props: { message: 'Test error message' },
        ...mountOptions,
      });
      const message = wrapper.find('p');
      expect(message.text()).toBe('Test error message');
      expect(message.classes()).toContain('text-red-900');
    });

    it('should handle long messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed correctly in the error banner component without any layout issues';
      const wrapper = mount(ErrorBanner, {
        props: { message: longMessage },
        ...mountOptions,
      });
      expect(wrapper.text()).toContain(longMessage);
    });
  });
});
