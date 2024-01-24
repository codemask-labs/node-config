import { config } from 'dotenv'

export const getEnvironmentVariables = (): Record<string, string> => {
    const { parsed = {} } = config()
    const result = { ...process.env, ...parsed } as Record<string, string>

    return Object.entries(result).reduce(
        (variables, [key, value]) => {
            if (value.includes('\n')) {
                return {
                    ...variables,
                    [key]: value.replaceAll(/\n+/g, '\\n').replaceAll(/\r+/g, '\\r')
                }
            }

            return {
                ...variables,
                [key]: value
            }
        },
        {}
    )
}
