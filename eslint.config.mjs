import codemaskConfig from 'eslint-config-codemask'

export default [
    ...codemaskConfig,
    {
        rules: {
            '@typescript-eslint/indent': 'off'
        }
    }
]
