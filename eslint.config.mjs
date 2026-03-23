import codemaskConfig from 'eslint-config-codemask'

export default [
    ...codemaskConfig,
    {
        rules: {
            '@typescript-eslint/indent': 'off'
        }
    },
    {
        files: ['**/*.spec.ts'],
        rules: {
            'max-classes-per-file': 'off',
            'functional/immutable-data': 'off',
            '@typescript-eslint/unbound-method': 'off'
        }
    }
]
