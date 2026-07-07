import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseButton from '../../../app/components/atoms/BaseButton.vue';
import PaginationNav from '../../../app/components/organisms/PaginationNav.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('PaginationNav', () => {
  describe('rendering', () => {
    it('should render navigation element', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 1, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.find('nav').exists()).toBe(true);
    });

    it('should render previous button', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      expect(buttons[0].text()).toBe('pagination.previous');
    });

    it('should render next button', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      expect(buttons[buttons.length - 1].text()).toBe('pagination.next');
    });

    it('should render page buttons', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      // Should render prev + pages + next
      expect(wrapper.findAllComponents(BaseButton).length).toBeGreaterThan(2);
    });

    it('should not render when totalPages is 1', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 1, totalPages: 1 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.findComponent(BaseButton).exists()).toBe(false);
    });

    it('should not render when totalPages is 0', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 1, totalPages: 0 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.findComponent(BaseButton).exists()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on nav element', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 1, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.find('nav').attributes('aria-label')).toBe('pagination.navigation');
    });

    it('should have sr-only text for current page indication', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.find('.sr-only').exists()).toBe(true);
    });

    it('should mark current page button with aria-current', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 3, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const currentButton = wrapper.find('[aria-current="page"]');
      expect(currentButton.exists()).toBe(true);
    });
  });

  describe('previous button', () => {
    it('should be disabled on first page', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 1, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const prevButton = wrapper.findAllComponents(BaseButton)[0];
      expect(prevButton.props('disabled')).toBe(true);
    });

    it('should be enabled on other pages', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const prevButton = wrapper.findAllComponents(BaseButton)[0];
      expect(prevButton.props('disabled')).toBe(false);
    });

    it('should emit page-change with decremented page', async () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 3, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const prevButton = wrapper.findAllComponents(BaseButton)[0];
      await prevButton.trigger('click');
      expect(wrapper.emitted('page-change')?.[0]).toEqual([2]);
    });
  });

  describe('next button', () => {
    it('should be disabled on last page', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 5, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.props('disabled')).toBe(true);
    });

    it('should be enabled on other pages', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.props('disabled')).toBe(false);
    });

    it('should emit page-change with incremented page', async () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 3, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      const nextButton = buttons[buttons.length - 1];
      await nextButton.trigger('click');
      expect(wrapper.emitted('page-change')?.[0]).toEqual([4]);
    });
  });

  describe('page buttons', () => {
    it('should show all pages when totalPages <= 7', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 3, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      // prev + 5 pages + next = 7 buttons
      expect(wrapper.findAllComponents(BaseButton).length).toBe(7);
    });

    it('should show ellipsis for many pages', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 5, totalPages: 20 },
        global: {
          components: { BaseButton },
        },
      });
      expect(wrapper.text()).toContain('...');
    });

    it('should emit page-change when page button is clicked', async () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      // Click page 3 button (index 2: prev, page1, page2, page3...)
      await buttons[3].trigger('click');
      expect(wrapper.emitted('page-change')?.[0]).toEqual([3]);
    });

    it('should not emit page-change when clicking current page', async () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      // Current page button (page 2)
      const currentButton = buttons.find(b => b.attributes('aria-current') === 'page');
      if (currentButton) {
        await currentButton.trigger('click');
        expect(wrapper.emitted('page-change')).toBeUndefined();
      }
    });
  });

  describe('page visibility logic', () => {
    it('should show first page when current is near start', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 20 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      // First page button should exist (after prev button)
      expect(buttons[1].text()).toContain('1');
    });

    it('should show last page when current is near end', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 19, totalPages: 20 },
        global: {
          components: { BaseButton },
          stubs: { BaseButton: false },
        },
      });
      const buttons = wrapper.findAllComponents(BaseButton);
      // Last page button should exist (before next button)
      expect(buttons[buttons.length - 2].text()).toContain('20');
    });

    it('should show current page and neighbors', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 10, totalPages: 20 },
        global: {
          components: { BaseButton },
        },
      });
      const text = wrapper.text();
      expect(text).toContain('10'); // current page
    });
  });

  describe('styling', () => {
    it('should have centered layout', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      const nav = wrapper.find('nav');
      expect(nav.classes()).toContain('flex');
      expect(nav.classes()).toContain('justify-center');
    });

    it('should have gap between buttons', () => {
      const wrapper = mount(PaginationNav, {
        props: { currentPage: 2, totalPages: 5 },
        global: {
          components: { BaseButton },
        },
      });
      const nav = wrapper.find('nav');
      expect(nav.classes()).toContain('gap-2');
    });
  });
});
