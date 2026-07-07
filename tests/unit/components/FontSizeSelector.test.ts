import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { createI18n } from 'vue-i18n';
import FontSizeSelector from '../../../app/components/molecules/FontSizeSelector.vue';

const mockSetFontSize = vi.fn();
const mockFontSize = ref<'normal' | 'large' | 'xlarge'>('normal');

vi.mock('../../../app/composables/useFontSize', () => ({
  useFontSize: () => ({
    fontSize: mockFontSize,
    setFontSize: mockSetFontSize,
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
  },
};

describe('FontSizeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFontSize.value = 'normal';
  });

  describe('rendering', () => {
    it('should render 3 font size buttons', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      expect(wrapper.findAll('button').length).toBe(3);
    });

    it('should render A, A+, A++ labels', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[0].text()).toBe('A');
      expect(buttons[1].text()).toBe('A+');
      expect(buttons[2].text()).toBe('A++');
    });

    it('should have group role', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });
  });

  describe('active state', () => {
    it('should highlight normal size button when active', () => {
      mockFontSize.value = 'normal';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[0].classes()).toContain('bg-hana-red');
      expect(buttons[0].classes()).toContain('text-white');
    });

    it('should highlight large size button when active', () => {
      mockFontSize.value = 'large';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[1].classes()).toContain('bg-hana-red');
      expect(buttons[1].classes()).toContain('text-white');
    });

    it('should highlight xlarge size button when active', () => {
      mockFontSize.value = 'xlarge';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[2].classes()).toContain('bg-hana-red');
      expect(buttons[2].classes()).toContain('text-white');
    });

    it('should show gray background for inactive buttons', () => {
      mockFontSize.value = 'normal';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[1].classes()).toContain('bg-transparent');
      expect(buttons[2].classes()).toContain('bg-transparent');
    });
  });

  describe('interactions', () => {
    it('should call setFontSize with normal when first button clicked', async () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      await wrapper.findAll('button')[0].trigger('click');
      expect(mockSetFontSize).toHaveBeenCalledWith('normal');
    });

    it('should call setFontSize with large when second button clicked', async () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      await wrapper.findAll('button')[1].trigger('click');
      expect(mockSetFontSize).toHaveBeenCalledWith('large');
    });

    it('should call setFontSize with xlarge when third button clicked', async () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      await wrapper.findAll('button')[2].trigger('click');
      expect(mockSetFontSize).toHaveBeenCalledWith('xlarge');
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on each button', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      buttons.forEach(button => {
        expect(button.attributes('aria-label')).toBeTruthy();
      });
    });

    it('should have aria-pressed="true" for active button', () => {
      mockFontSize.value = 'large';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[1].attributes('aria-pressed')).toBe('true');
    });

    it('should have aria-pressed="false" for inactive buttons', () => {
      mockFontSize.value = 'large';
      const wrapper = mount(FontSizeSelector, mountOptions);
      const buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-pressed')).toBe('false');
      expect(buttons[2].attributes('aria-pressed')).toBe('false');
    });

    it('should have aria-label on group', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBeTruthy();
    });
  });

  describe('styling', () => {
    it('should have rounded border', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      const group = wrapper.find('[role="group"]');
      expect(group.classes()).toContain('rounded-lg');
      expect(group.classes()).toContain('border-2');
    });

    it('should have gap between buttons', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      expect(wrapper.find('[role="group"]').classes()).toContain('gap-1');
    });

    it('should have padding', () => {
      const wrapper = mount(FontSizeSelector, mountOptions);
      expect(wrapper.find('[role="group"]').classes()).toContain('p-1');
    });
  });
});
