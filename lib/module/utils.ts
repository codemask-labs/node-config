import { ClassTransformOptions, plainToInstance, TransformOptions } from 'class-transformer'
import { getMetadataStorage, validateSync } from 'class-validator'
import { configDotenv } from 'dotenv'
import { isNotNil } from 'ramda'
import { ValidationException } from 'lib/exceptions'
import { toValueByType } from 'lib/utils'
import { Class, RegisteredConfig } from './types'
import { registry } from './constants'

export const registerConfigDefaults = (base: Class) => {
    if (!registry.has(base)) {
        const dependencies: Array<Class> = Reflect.getMetadata('design:paramtypes', base) || []

        registry.set(base, {
            base,
            dependencies,
            resolvedDependencies: dependencies.map(() => null),
            propertyNameTranslations: {},
            instance: null
        })
    }
}

export const registerConfigTransformOptions = (base: Class, transformOptions?: ClassTransformOptions) => {
    const current = registry.get(base)

    if (!current) {
        throw new Error(`Failed to find registered config. Make sure to decorate a class with @Config()!`)
    }

    registry.set(base, {
        ...current,
        transformOptions
    })
}

export const registerConfigTransformTranslations = (base: Class, propertyName: string, environmentPropertyName: string) => {
    const current = registry.get(base)

    if (!current) {
        throw new Error(`Failed to find registered config. Make sure to decorate a class with @Config()!`)
    }

    registry.set(base, {
        ...current,
        propertyNameTranslations: {
            ...current?.propertyNameTranslations,
            [propertyName]: environmentPropertyName
        }
    })
}

export const getConfigInstance = <T extends Class>(base: T, transformOptions?: TransformOptions): InstanceType<T> => {
    const registeredDependency = registry.get(base)

    if (!registeredDependency) {
        throw new Error(`Failed to find registered config. Make sure to decorate a class with @Config()!`)
    }

    if (registeredDependency.instance) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return registeredDependency.instance
    }

    const resolvedDependencies = registeredDependency.resolvedDependencies.map((instance, index) => {
        const dependency = registeredDependency.dependencies.at(index)

        if (!dependency) {
            throw new Error(`Failed to resolve dependency for [${base.name}] at index: ${index}`)
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return instance ?? getConfigInstance(dependency)
    })

    const { parsed: environmentVariables = {} } = configDotenv({
        override: false
    })

    const storage = getMetadataStorage()
    const metadatas = storage.getTargetValidationMetadatas(base, base.name, false, false)
    const transformedProperties = metadatas.reduce(
        (acc, { propertyName, target }) => {
            if (acc[propertyName]) {
                return acc
            }

            const prototype: object = typeof target === 'function' ? target.prototype : {}
            const environmentPropertyName = registeredDependency.propertyNameTranslations[propertyName]

            const key = environmentPropertyName || propertyName
            const value = environmentVariables[key] || process.env[key]
            const type = Reflect.getMetadata('design:type', prototype, propertyName)

            return {
                ...acc,
                [propertyName]: isNotNil(value) ? toValueByType(type, value) : value
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>
    )

    /**
     * Make the instance methods, auto-bindable to "this" reference so we can destruct the
     * config instance. For example:
     *
     * const { getSomeValue } = getConfig(ExampleConfig)
     *
     * The `getSomeValue` method, can have a reference to "this" inside. Therefore unallowing us,
     * for destructing such method of the config.
     */

    const descriptors = Object.getOwnPropertyDescriptors(base.prototype)
    const descriptorNames = Object.keys(descriptors).filter(name => name !== 'constructor')
    const unreferencedMethods = descriptorNames.reduce(
        (result, name) => {
            const descriptor = descriptors[name]

            return {
                ...result,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, functional/functional-parameters
                [name]: (...args: Array<any>) => descriptor.value.apply(instance, args)
            }
        },
        {} as Record<string, () => void>
    )

    /**
     * Due to missing option for passing constructor arguments, we are creating
     * here a constructor wrapper, for passing default arguments to the super class constructor.
     * This allows us to pass the constructor arguments when calling `plainToInstance` for `class-transformer`.
     */

    class ConfigConstructorWrapper extends base {
        static readonly name = base.name

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, functional/functional-parameters
        constructor(...unusedArgs: Array<any>) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            super(...resolvedDependencies)
        }
    }

    // eslint-disable-next-line functional/immutable-data
    Object.assign(ConfigConstructorWrapper.prototype, unreferencedMethods)

    const instance = plainToInstance(ConfigConstructorWrapper, transformedProperties, {
        exposeDefaultValues: true,
        enableImplicitConversion: true,
        ...transformOptions
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const validationErrors = validateSync(instance, {
        forbidUnknownValues: false,
        validationError: {
            target: true,
            value: true
        }
    })

    if (validationErrors.length) {
        throw new ValidationException(base.name, validationErrors)
    }

    const config: RegisteredConfig = {
        ...registeredDependency,
        resolvedDependencies,
        instance
    }

    registry.set(base, config)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config.instance
}
