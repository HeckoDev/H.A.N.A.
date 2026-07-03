import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseInput from '~/components/atoms/BaseInput.vue';

describe('BaseInput', () => {
  it('should render with required props', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    });

    expect(wrapper.find('label').text()).toContain('Test Label');
    expect(wrapper.find('input').attributes('id')).toBe('test-input');
  });

  it('should emit update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test',
        modelValue: '',
      },
    });

    const input = wrapper.find('input');
    await input.setValue('new value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
  });

  it('should display error message when error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Email',
        modelValue: '',
        error: 'Invalid email format',
      },
    });

    const errorSpan = wrapper.find('[role="alert"]');
    expect(errorSpan.text()).toBe('Invalid email format');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
  });

  it('should apply correct type attribute', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'email-input',
        label: 'Email',
        modelValue: '',
        type: 'email',
      },
    });

    expect(wrapper.find('input').attributes('type')).toBe('email');
  });

  it('should mark as required when required prop is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'required-input',
        label: 'Name',
        modelValue: '',
        required: true,
      },
    });

    expect(wrapper.find('input').attributes('required')).toBeDefined();
    expect(wrapper.find('label').text()).toContain('*');
  });

  it('should hide label visually when hideLabel is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'hidden-label-input',
        label: 'Search',
        modelValue: '',
        hideLabel: true,
      },
    });

    expect(wrapper.find('label').classes()).toContain('sr-only');
  });

  it('should set aria-describedby when error is present', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test',
        modelValue: '',
        error: 'Error message',
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('aria-describedby')).toBeDefined();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toBe('Error message');
  });

  it('should apply error styles when error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test',
        modelValue: '',
        error: 'Error',
      },
    });

    expect(wrapper.find('input').classes()).toContain('border-red-600');
  });
});
