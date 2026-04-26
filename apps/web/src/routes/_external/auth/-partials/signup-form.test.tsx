import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { SignupForm } from './signup-form';

describe('SignupForm', () => {
	it('renders the signup form', async () => {
		const screen = await render(<SignupForm serverError={null} onSubmit={vi.fn()} onGoToLogin={vi.fn()} />);

		await expect.element(screen.getByText('Create an account')).toBeVisible();
		await expect.element(screen.getByLabelText('Name')).toBeVisible();
		await expect.element(screen.getByLabelText('Email')).toBeVisible();
		await expect.element(screen.getByLabelText('Password', { exact: true })).toBeVisible();
		await expect.element(screen.getByLabelText('Confirm Password', { exact: true })).toBeVisible();
		await expect.element(screen.getByRole('button', { name: 'Create account' })).toBeVisible();
	});

	it('shows validation errors on empty submit', async () => {
		const screen = await render(<SignupForm serverError={null} onSubmit={vi.fn()} onGoToLogin={vi.fn()} />);

		await screen.getByRole('button', { name: 'Create account' }).click();

		await expect.element(screen.getByText('Name is required')).toBeVisible();
		await expect.element(screen.getByText('Email is required')).toBeVisible();
		await expect.element(screen.getByText('Password must be at least 8 characters')).toBeVisible();
		await expect.element(screen.getByText('Please confirm your password')).toBeVisible();
	});

	it('shows an invalid email validation error', async () => {
		const screen = await render(<SignupForm serverError={null} onSubmit={vi.fn()} onGoToLogin={vi.fn()} />);

		await screen.getByLabelText('Name').fill('Signup User');
		await screen.getByLabelText('Email').fill('not-an-email');
		await screen.getByLabelText('Password', { exact: true }).fill('password123');
		await screen.getByLabelText('Confirm Password', { exact: true }).fill('password123');
		await screen.getByRole('button', { name: 'Create account' }).click();

		await expect.element(screen.getByText('Invalid email address')).toBeVisible();
	});

	it('shows a password mismatch validation error', async () => {
		const screen = await render(<SignupForm serverError={null} onSubmit={vi.fn()} onGoToLogin={vi.fn()} />);

		await screen.getByLabelText('Name').fill('Signup User');
		await screen.getByLabelText('Email').fill('signup@example.com');
		await screen.getByLabelText('Password', { exact: true }).fill('password123');
		await screen.getByLabelText('Confirm Password', { exact: true }).fill('different123');
		await screen.getByRole('button', { name: 'Create account' }).click();

		await expect.element(screen.getByText('Passwords do not match')).toBeVisible();
	});

	it('calls onSubmit with the entered values', async () => {
		const onSubmit = vi.fn();
		const screen = await render(<SignupForm serverError={null} onSubmit={onSubmit} onGoToLogin={vi.fn()} />);

		await screen.getByLabelText('Name').fill('Signup User');
		await screen.getByLabelText('Email').fill('signup@example.com');
		await screen.getByLabelText('Password', { exact: true }).fill('password123');
		await screen.getByLabelText('Confirm Password', { exact: true }).fill('password123');
		await screen.getByRole('button', { name: 'Create account' }).click();

		await vi.waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({
				name: 'Signup User',
				email: 'signup@example.com',
				password: 'password123',
				confirmPassword: 'password123',
			});
		});
	});

	it('renders the server error message', async () => {
		const screen = await render(<SignupForm serverError="User already exists" onSubmit={vi.fn()} onGoToLogin={vi.fn()} />);

		await expect.element(screen.getByText('User already exists')).toBeVisible();
	});

	it('calls onGoToLogin when the login action is clicked', async () => {
		const onGoToLogin = vi.fn();
		const screen = await render(<SignupForm serverError={null} onSubmit={vi.fn()} onGoToLogin={onGoToLogin} />);

		await screen.getByRole('button', { name: 'Log in' }).click();

		await vi.waitFor(() => {
			expect(onGoToLogin).toHaveBeenCalledOnce();
		});
	});
});
