import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import ThemeToggle from '../../../app/components/molecules/ThemeToggle.vue';
import BaseButton from '../../../app/components/atoms/BaseButton.vue';
import BaseIcon from '../../../app/components/atoms/BaseIcon.vue';

const mockToggleTheme = vi.fn();
const mockTheme = ref<'light' | 'dark'>('light');

vi.mock('../../../app/composables/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
  }),
}));

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

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.value = 'light';
  });

  describe('rendering', () => {
    it('should render button', () => {
      const wrapper = mount(ThemeToggle, mountOptions);
      expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
    });

    it('should render moon icon when in light mode', () => {
      mockTheme.value = 'light';
      const wrapper = mount(ThemeToggle, mountOptions);
      const icon = wrapper.findComponent(BaseIcon);
      expect(icon.props('name')).toBe('moon');
    });

    it('should render sun icon when in dark mode', () => {
      mockTheme.value = 'dark';
      const wrapper = mount(ThemeToggle, mountOptions);
      const icon = wrapper.findComponent(BaseIcon);
      expect(icon.props('name')).toBe('sun');
    });
  });

  describe('interactions', () => {
    it('should call toggleTheme when button clicked', async () => {
      const wrapper = mount(ThemeToggle, mountOptions);
      await wrapper.findComponent(BaseButton).trigger('click');
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should toggle from light to dark', async () => {
      mockTheme.value = 'light';
      const wrapper = mount(ThemeToggle, mountOptions);
      const button = wrapper.findComponent(BaseButton);
      await button.trigger('click');
      expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('should toggle from dark to light', async () => {
      mockTheme.value = 'dark';
      const wrapper = mount(ThemeToggle, mountOptions);
      const button = wrapper.findComponent(BaseButton);
      await button.trigger('click');
      expect(mockToggleTheme).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have aria-label', () => {
      const wrapper = mount(ThemeToggle, mountOptions);
      const button = wrapper.findComponent(BaseButton);
      expect(button.attributes('aria-label')).toBeTruthy();
    });

    it('should have aria-hidden on icon', () => {
      const wrapper = mount(ThemeToggle, mountOptions);
      const icon = wrapper.findComponent(BaseIcon);
      expect(icon.attributes('aria-hidden')).toBe('true');
    });
  });
});
