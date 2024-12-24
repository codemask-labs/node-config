// eslint-disable-next-line max-classes-per-file
import { configDotenv } from 'dotenv'
import { isNotNil, reject } from 'ramda'
import { ClassTransformOptions, plainToInstance, TransformOptions } from 'class-transformer'
import { getMetadataStorage, validateSync } from 'class-validator'
import { isUndefined, toValueByType } from 'lib/utils'
import { ValidationException } from 'lib/exceptions'
import { Class, RegisteredConfig } from './types'

export class ConfigRegistry {
    public static readonly registry = new Map<Class, RegisteredConfig>()

    public static registerConfigDefaults(constructor: Class) {
        if (!this.registry.has(constructor)) {
            const dependencies: Array<Class> = Reflect.getMetadata('design:paramtypes', constructor) || []

            this.registry.set(constructor, {
                constructor,
                dependencies,
                resolvedDependencies: dependencies.map(() => null),
                propertyNameTranslations: {},
                instance: null
            })
        }
    }

    public static registerConfigTransformOptions(constructor: Class, transformOptions?: ClassTransformOptions) {
        const current = this.registry.get(constructor)

        if (!current) {
            throw new Error(`Failed to find registered config. Make sure to decorate a class with @Config()!`)
        }

        this.registry.set(constructor, {
            ...current,
            transformOptions
        })
    }

    public static registerConfigTransformTranslations(constructor: Class, propertyName: string, environmentPropertyName: string) {
        const current = this.registry.get(constructor)

        if (!current) {
            throw new Error(`Failed to find registered config. Make sure to decorate a class with @Config()!`)
        }

        this.registry.set(constructor, {
            ...current,
            propertyNameTranslations: {
                ...current?.propertyNameTranslations,
                [propertyName]: environmentPropertyName
            }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static getConfigInstance<T extends Class<any>>(constructor: T, transformOptions?: TransformOptions): InstanceType<T> {
        const registeredDependency = this.registry.get(constructor)

        if (!registeredDependency) {
            throw new Error(`Config is not properly registered`)
        }

        if (registeredDependency.instance) {
            return registeredDependency.instance
        }

        const resolvedDependencies = registeredDependency.resolvedDependencies.map((instance, index) => {
            const dependency = registeredDependency.dependencies.at(index)

            if (!dependency) {
                throw new Error('Failed to find depndency alignment')
            }

            return instance ?? this.getConfigInstance(dependency)
        })

        const { parsed: environmentVariables = {} } = configDotenv({
            override: false
        })

        const storage = getMetadataStorage()
        const metadatas = storage.getTargetValidationMetadatas(constructor, constructor.name, false, false)
        const transformedProperties = metadatas.reduce(
            (acc, { propertyName, target }) => {
                if (acc[propertyName]) {
                    return acc
                }

                const prototype = typeof target === 'function' ? target.prototype : {}
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

        const descriptors = Object.getOwnPropertyDescriptors(constructor.prototype)
        const descriptorNames = Object.keys(descriptors).filter(name => name !== 'constructor')
        const unreferencedMethods = descriptorNames.reduce(
            (result, name) => {
                const descriptor = descriptors[name]

                return {
                    ...result,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    [name]: (...args: Array<any>) => descriptor.value.apply(instance, args)
                }
            },
            {} as Record<string, () => void>
        )

        class UnreferencedConstructor extends constructor {
            public static readonly name = constructor.name

            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
            constructor(...unusedArgs: Array<any>) {
                super(...resolvedDependencies)
            }
        }

        // eslint-disable-next-line functional/immutable-data
        Object.assign(UnreferencedConstructor.prototype, unreferencedMethods)

        const instance = plainToInstance(UnreferencedConstructor, transformedProperties, {
            exposeDefaultValues: true,
            enableImplicitConversion: true,
            ...transformOptions
        })

        // eslint-disable-next-line functional/immutable-data
        Object.assign(instance, reject(isUndefined, transformedProperties))

        const validationErrors = validateSync(instance, {
            forbidUnknownValues: false,
            validationError: {
                target: true,
                value: true
            }
        })

        if (validationErrors.length) {
            throw new ValidationException(constructor.name, validationErrors)
        }

        const config: RegisteredConfig = {
            ...registeredDependency,
            resolvedDependencies,
            instance
        }

        this.registry.set(constructor, config)

        return config.instance
    }
}
