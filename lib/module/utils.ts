import { config } from 'dotenv'
import { Class } from './types'

config()

export const getEnvironmentVariables = <T extends Record<string, string> = Record<string, string>>(): T => process.env as T

export const getInstanceProperties = <Instance>(instance: Class<Instance>) => {
    const properties = Object.getOwnPropertyNames(instance)
    const prototype = Object.getPrototypeOf(instance)
    const methods = Object.getOwnPropertyNames(prototype)
        .filter(name => name !== 'constructor')

    const propertyNames = [...methods, ...properties] as Array<keyof typeof instance>

    return propertyNames.reduce((result, propertyName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = instance[propertyName] as any

        if (typeof value === 'function') {
            return {
                ...result,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                [propertyName]: (...args: Array<any>) => value.apply(config, args)
            }
        }

        return {
            ...result,
            [propertyName]: value
        }
    }, {})
}
