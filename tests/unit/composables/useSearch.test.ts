import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRouter } from 'vue-router';
import { useSearch } from '../../../app/composables/useSearch';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

describe('useSearch', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
    mockPush.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with empty query', () => {
      const { query } = useSearch();
      expect(query.value).toBe('');
    });

    it('should initialize with isLoading false', () => {
      const { isLoading } = useSearch();
      expect(isLoading.value).toBe(false);
    });
  });

  describe('search', () => {
    it('should navigate to search page with query', () => {
      const { query, search } = useSearch();
      query.value = 'test query';
      search();
      expect(mockPush).toHaveBeenCalledWith({
        path: '/search',
        query: { q: 'test query' },
      });
    });

    it('should trim whitespace from query', () => {
      const { query, search } = useSearch();
      query.value = '  test query  ';
      search();
      expect(mockPush).toHaveBeenCalledWith({
        path: '/search',
        query: { q: 'test query' },
      });
    });

    it('should not navigate with empty query', () => {
      const { query, search } = useSearch();
      query.value = '';
      search();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should not navigate with whitespace only query', () => {
      const { query, search } = useSearch();
      query.value = '   ';
      search();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should handle special characters in query', () => {
      const { query, search } = useSearch();
      query.value = 'test & query ?';
      search();
      expect(mockPush).toHaveBeenCalledWith({
        path: '/search',
        query: { q: 'test & query ?' },
      });
    });
  });

  describe('query reactivity', () => {
    it('should allow query to be updated', () => {
      const { query } = useSearch();
      query.value = 'first query';
      expect(query.value).toBe('first query');
      query.value = 'second query';
      expect(query.value).toBe('second query');
    });

    it('should maintain query value after search', () => {
      const { query, search } = useSearch();
      query.value = 'test';
      search();
      expect(query.value).toBe('test');
    });
  });
});
