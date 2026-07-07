import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import BaseButton from '../../../app/components/atoms/BaseButton.vue';
import BaseIcon from '../../../app/components/atoms/BaseIcon.vue';
import BaseSpinner from '../../../app/components/atoms/BaseSpinner.vue';
import SearchBar from '../../../app/components/molecules/SearchBar.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('SearchBar', () => {
  describe('rendering', () => {
    it('should render a search form', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false, BaseIcon: false, BaseSpinner: false },
        },
      });
      expect(wrapper.find('form[role="search"]').exists()).toBe(true);
    });

    it('should render search input', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('input[type="search"]').exists()).toBe(true);
    });

    it('should render submit button', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('should render search icon when not loading', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', isLoading: false },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false, BaseIcon: false },
        },
      });
      expect(wrapper.findComponent(BaseIcon).exists()).toBe(true);
    });

    it('should render spinner when loading', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', isLoading: true },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false, BaseSpinner: false },
        },
      });
      expect(wrapper.findComponent(BaseSpinner).exists()).toBe(true);
    });
  });

  describe('input binding', () => {
    it('should display modelValue in input', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test query' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('test query');
    });

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      const input = wrapper.find('input');
      await input.setValue('new query');
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new query']);
    });

    it('should use placeholder prop', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', placeholder: 'Custom placeholder' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('input').attributes('placeholder')).toBe('Custom placeholder');
    });

    it('should use default placeholder', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('input').attributes('placeholder')).toBe('Rechercher...');
    });
  });

  describe('submit behavior', () => {
    it('should emit search event on form submit', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.emitted('search')).toHaveLength(1);
    });

    it('should not emit search on submit with empty query', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.emitted('search')).toBeUndefined();
    });

    it('should not emit search on submit with whitespace only', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '   ' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.emitted('search')).toBeUndefined();
    });

    it('should emit search on button click', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false },
        },
      });
      await wrapper.find('button[type="submit"]').trigger('click');
      await nextTick();
      expect(wrapper.emitted('search')).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('should disable button when loading', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', isLoading: true },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false },
        },
      });
      expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    });

    it('should enable button when not loading', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', isLoading: false },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
          stubs: { BaseButton: false },
        },
      });
      expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    });
  });

  describe('accessibility', () => {
    it('should have role="search" on form', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('form').attributes('role')).toBe('search');
    });

    it('should have label for search input', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      const label = wrapper.find('label[for="search-input"]');
      expect(label.exists()).toBe(true);
      expect(label.classes()).toContain('sr-only');
    });

    it('should have autocomplete="off"', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
        global: {
          components: { BaseButton, BaseIcon, BaseSpinner },
        },
      });
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off');
    });
  });
});
