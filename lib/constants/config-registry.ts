import { config as dotenv } from 'dotenv'
import { ClassTransformOptions, plainToInstance } from 'class-transformer'
import { Class } from 'lib/common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<Class, any>()

export const registerConfigClass = <T>(Config: Class<T>, options?: ClassTransformOptions) => {
    if (registry.has(Config)) {
        return
    }

    const { parsed = {} } = dotenv({
        processEnv: {}
    })

    const config = new Config()
    const properties = Object.getOwnPropertyNames(config)
    const variables = { ...process.env, ...parsed }

    console.log('parsed:', parsed)
    console.log('properties:', properties)

    const instance = plainToInstance(Config, variables, {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
        ...options
    })

    registry.set(Config, instance)
}

export const getConfigInstance = <T>(config: Class<T>) => {
    const instance = registry.get(config)

    if (!instance) {
        throw new Error(`failed to find registered config: [class ${config.name}]`)
    }

    return instance
}

export const isFeatureRegistered = <T>(config: Class<T>) => registry.has(config)
