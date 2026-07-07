import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SearchResultItem from '~/components/molecules/SearchResultItem.vue';

describe('SearchResultItem', () => {
  const defaultProps = {
    title: 'Test Result',
    url: 'https://example.com/page',
    description: 'This is a test description for the search result',
  };

  it('should render all required content', () => {
    const wrapper = mount(SearchResultItem, {
      props: defaultProps,
    });

    expect(wrapper.find('a').text()).toBe('Test Result');
    expect(wrapper.text()).toContain('example.com');
    expect(wrapper.text()).toContain('This is a test description');
  });

  it('should create a valid external link', () => {
    const wrapper = mount(SearchResultItem, {
      props: defaultProps,
    });

    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe('https://example.com/page');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('should extract and display hostname from URL', () => {
    const wrapper = mount(SearchResultItem, {
      props: defaultProps,
    });

    expect(wrapper.find('span').text()).toBe('example.com');
  });

  it('should handle invalid URLs gracefully', () => {
    const wrapper = mount(SearchResultItem, {
      props: {
        title: 'Invalid URL Result',
        url: 'not-a-valid-url',
        description: 'Test description',
      },
    });

    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe('#');
    expect(wrapper.find('span').text()).toBe('not-a-valid-url');
  });

  it('should use article semantic element', () => {
    const wrapper = mount(SearchResultItem, {
      props: defaultProps,
    });

    expect(wrapper.element.tagName).toBe('ARTICLE');
  });

  it('should apply hover and focus styles', () => {
    const wrapper = mount(SearchResultItem, {
      props: defaultProps,
    });

    const article = wrapper.find('article');
    expect(article.classes()).toContain('hover:shadow-md');
    expect(article.classes()).toContain('focus-within:ring-2');
  });

  it('should handle HTTPS URLs correctly', () => {
    const wrapper = mount(SearchResultItem, {
      props: {
        ...defaultProps,
        url: 'https://secure.example.com/path',
      },
    });

    expect(wrapper.find('a').attributes('href')).toBe('https://secure.example.com/path');
  });

  it('should handle HTTP URLs correctly', () => {
    const wrapper = mount(SearchResultItem, {
      props: {
        ...defaultProps,
        url: 'http://example.com',
      },
    });

    expect(wrapper.find('a').attributes('href')).toBe('http://example.com');
  });

  it('should reject non-http(s) protocols', () => {
    const wrapper = mount(SearchResultItem, {
      props: {
        ...defaultProps,
        url: 'javascript:alert("xss")',
      },
    });

    expect(wrapper.find('a').attributes('href')).toBe('#');
  });
});
