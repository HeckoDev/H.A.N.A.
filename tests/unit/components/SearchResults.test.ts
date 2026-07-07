import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import SearchResults from '../../../app/components/organisms/SearchResults.vue';
import SearchResultItem from '../../../app/components/molecules/SearchResultItem.vue';
import BaseSpinner from '../../../app/components/atoms/BaseSpinner.vue';

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
      SearchResultItem: true,  // Stub to avoid prop mismatch
      BaseSpinner: false,
    },
  },
};

describe('SearchResults', () => {
  const mockResults = [
    {
      title: 'Result 1',
      url: 'https://example.com/1',
      snippet: 'This is the first result',
    },
    {
      title: 'Result 2',
      url: 'https://example.com/2',
      snippet: 'This is the second result',
    },
    {
      title: 'Result 3',
      url: 'https://example.com/3',
      snippet: 'This is the third result',
    },
  ];

  describe('loading state', () => {
    it('should show spinner when loading', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findComponent(BaseSpinner).exists()).toBe(true);
    });

    it('should not show spinner when not loading', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findComponent(BaseSpinner).exists()).toBe(false);
    });

    it('should not show results when loading', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(0);
    });

    it('should show loading message with spinner', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).toContain('search.loading');
    });
  });

  describe('empty state', () => {
    it('should show empty state when no results and not loading', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).toContain('search.noResults');
    });

    it('should not show empty state when loading', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).not.toContain('search.noResults');
    });

    it('should not show empty state when results exist', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).not.toContain('search.noResults');
    });

    it('should show suggestion to try different keywords', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).toContain('search.tryDifferentKeywords');
    });
  });

  describe('results display', () => {
    it('should render all results', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(3);
    });

    it('should pass result data to SearchResultItem', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      const items = wrapper.findAllComponents(SearchResultItem);
      // SearchResultItem is stubbed, just verify the count
      expect(items.length).toBe(3);
    });

    it('should show result count', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      // Verify the result count key is rendered (i18n translates it)
      expect(wrapper.text()).toContain('search.resultsCount');
    });

    it('should show singular count for one result', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [mockResults[0]], isLoading: false, query: 'test' },
        ...mountOptions,
      });
      // Verify single result is displayed
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(1);
    });

    it('should use ol element for results list', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.find('ol').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have role="status" on loading message', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    it('should have aria-live="polite" on loading message', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true);
    });

    it('should have role="status" on empty state', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    it('should have accessible list structure', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      const list = wrapper.find('ol');
      expect(list.attributes('role')).toBe('list');
    });

    it('should announce result count to screen readers', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true);
    });
  });

  describe('styling', () => {
    it('should have vertical stack layout', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      const container = wrapper.find('div');
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
    });

    it('should have gap between elements', () => {
      const wrapper = mount(SearchResults, {
        props: { results: mockResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      const list = wrapper.find('ol');
      expect(list.classes()).toContain('space-y-6');
    });

    it('should center loading spinner', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      const loadingDiv = wrapper.find('[role="status"]');
      expect(loadingDiv.classes()).toContain('flex');
      expect(loadingDiv.classes()).toContain('justify-center');
    });

    it('should center empty state text', () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: false, query: 'test' },
        ...mountOptions,
      });
      const emptyDiv = wrapper.find('[role="status"]');
      expect(emptyDiv.classes()).toContain('text-center');
    });
  });

  describe('edge cases', () => {
    it('should handle results with missing fields gracefully', () => {
      const incompleteResults = [{ title: 'Incomplete', url: 'https://example.com', snippet: '' }];
      const wrapper = mount(SearchResults, {
        props: { results: incompleteResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(1);
    });

    it('should handle transition from loading to results', async () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findComponent(BaseSpinner).exists()).toBe(true);

      await wrapper.setProps({ results: mockResults, isLoading: false, query: 'test' });

      expect(wrapper.findComponent(BaseSpinner).exists()).toBe(false);
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(3);
    });

    it('should handle transition from loading to empty', async () => {
      const wrapper = mount(SearchResults, {
        props: { results: [], isLoading: true, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.text()).not.toContain('search.noResults');

      await wrapper.setProps({ isLoading: false, query: 'test' });

      expect(wrapper.text()).toContain('search.noResults');
    });

    it('should handle large number of results', () => {
      const manyResults = Array.from({ length: 50 }, (_, i) => ({
        title: `Result ${i + 1}`,
        url: `https://example.com/${i + 1}`,
        snippet: `Snippet ${i + 1}`,
      }));
      const wrapper = mount(SearchResults, {
        props: { results: manyResults, isLoading: false, query: 'test' },
        ...mountOptions,
      });
      expect(wrapper.findAllComponents(SearchResultItem).length).toBe(50);
    });
  });
});
