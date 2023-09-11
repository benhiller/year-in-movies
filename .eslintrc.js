module.exports = {
  extends: [
    'standard',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  plugins: ['react-refresh'],
  globals: {
    fetch: false,
    ResizeObserver: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
