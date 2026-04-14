import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const nodeConfig = {
	files: ['{apps/api,packages/types}/**/*.{js,mjs,cjs,ts}'],
	languageOptions: {
		globals: {
			...globals.node,
		},
	},
	extends: [js.configs.recommended, tseslint.configs.recommended],
};

const reactConfig = {
	settings: {
		react: {
			version: 'detect',
		},
	},
	files: ['apps/web/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
	ignores: ['apps/web/@/components/ui/**', '**/public/**'],
	plugins: {
		react,
		'react-hooks': reactHooks,
	},
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
		globals: {
			...globals.browser,
		},
	},
	extends: [js.configs.recommended, tseslint.configs.recommended, react.configs.flat.recommended, reactHooks.configs.flat.recommended],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/jsx-uses-react': 'off',
		'react/no-children-prop': 'off', // shadcn/ui uses children prop sometimes
	},
};

export default defineConfig([globalIgnores(['**/dist/**', '**/node_modules/**']), nodeConfig, reactConfig]);
