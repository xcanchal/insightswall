import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
	it('renders the login form', async () => {
		const screen = await render(<LoginForm serverError={null} onSubmit={vi.fn()} onGoToSignup={vi.fn()} />);

		await expect.element(screen.getByText('Log in to your account')).toBeVisible();
		await expect.element(screen.getByLabelText('Email')).toBeVisible();
		await expect.element(screen.getByLabelText('Password', { exact: true })).toBeVisible();
		await expect.element(screen.getByRole('button', { name: 'Log in' })).toBeVisible();
	});

	it('shows validation errors on empty submit', async () => {
		const screen = await render(<LoginForm serverError={null} onSubmit={vi.fn()} onGoToSignup={vi.fn()} />);

		await screen.getByRole('button', { name: 'Log in' }).click();

		await expect.element(screen.getByText('Email is required')).toBeVisible();
		await expect.element(screen.getByText('Password is required')).toBeVisible();
	});

	it('shows an invalid email validation error', async () => {
		const screen = await render(<LoginForm serverError={null} onSubmit={vi.fn()} onGoToSignup={vi.fn()} />);

		await screen.getByLabelText('Email').fill('not-an-email');
		await screen.getByLabelText('Password', { exact: true }).fill('password123');
		await screen.getByRole('button', { name: 'Log in' }).click();

		await expect.element(screen.getByText('Invalid email address')).toBeVisible();
	});

	it('calls onSubmit with the entered credentials', async () => {
		const onSubmit = vi.fn();
		const screen = await render(<LoginForm serverError={null} onSubmit={onSubmit} onGoToSignup={vi.fn()} />);

		await screen.getByLabelText('Email').fill('user@example.com');
		await screen.getByLabelText('Password', { exact: true }).fill('password123');
		await screen.getByRole('button', { name: 'Log in' }).click();

		await vi.waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'password123',
			});
		});
	});

	it('renders the server error message', async () => {
		const screen = await render(<LoginForm serverError="Invalid email or password" onSubmit={vi.fn()} onGoToSignup={vi.fn()} />);

		await expect.element(screen.getByText('Invalid email or password')).toBeVisible();
	});

	it('calls onGoToSignup when the signup action is clicked', async () => {
		const onGoToSignup = vi.fn();
		const screen = await render(<LoginForm serverError={null} onSubmit={vi.fn()} onGoToSignup={onGoToSignup} />);

		await screen.getByRole('button', { name: 'Sign up' }).click();

		await vi.waitFor(() => {
			expect(onGoToSignup).toHaveBeenCalledOnce();
		});
	});
});
