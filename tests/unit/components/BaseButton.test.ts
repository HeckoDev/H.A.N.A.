import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseButton from '~/components/atoms/BaseButton.vue';

describe('BaseButton', () => {
  it('should render with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toBe('Click me');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain('bg-hana-red');
    expect(wrapper.classes()).toContain('h-12');
  });

  it('should apply variant classes correctly', () => {
    const primaryWrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Primary' },
    });
    expect(primaryWrapper.classes()).toContain('bg-hana-red');

    const secondaryWrapper = mount(BaseButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Secondary' },
    });
    expect(secondaryWrapper.classes()).toContain('bg-white');
    expect(secondaryWrapper.classes()).toContain('border-hana-dark');

    const ghostWrapper = mount(BaseButton, {
      props: { variant: 'ghost' },
      slots: { default: 'Ghost' },
    });
    expect(ghostWrapper.classes()).toContain('bg-transparent');
  });

  it('should apply size classes correctly', () => {
    const smWrapper = mount(BaseButton, {
      props: { size: 'sm' },
      slots: { default: 'Small' },
    });
    expect(smWrapper.classes()).toContain('h-11');

    const mdWrapper = mount(BaseButton, {
      props: { size: 'md' },
      slots: { default: 'Medium' },
    });
    expect(mdWrapper.classes()).toContain('h-12');

    const lgWrapper = mount(BaseButton, {
      props: { size: 'lg' },
      slots: { default: 'Large' },
    });
    expect(lgWrapper.classes()).toContain('h-14');
  });

  it('should handle disabled state', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('disabled:opacity-50');
  });

  it('should set aria-label when provided', () => {
    const wrapper = mount(BaseButton, {
      props: { ariaLabel: 'Close dialog' },
      slots: { default: 'X' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Close dialog');
  });

  it('should set type attribute correctly', () => {
    const submitWrapper = mount(BaseButton, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    });
    expect(submitWrapper.attributes('type')).toBe('submit');

    const resetWrapper = mount(BaseButton, {
      props: { type: 'reset' },
      slots: { default: 'Reset' },
    });
    expect(resetWrapper.attributes('type')).toBe('reset');
  });

  it('should emit click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click me' },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
