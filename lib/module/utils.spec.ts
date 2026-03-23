import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { Config, Env } from 'lib/decorators'
import { NodeEnv } from 'example/enums'
import { ValidationException } from 'lib/exceptions'
import { Class } from './types'
import { registry } from './constants'
import {
    registerConfigDefaults,
    registerConfigTransformOptions,
    registerConfigTransformTranslations,
    getConfigInstance
} from './utils'

beforeEach(() => {
    registry.clear()
})

describe('registerConfigDefaults', () => {
    it('registers a class in the registry', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)

        expect(registry.has(TestConfig)).toBe(true)
    })

    it('sets correct default values in registry entry', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)

        const entry = registry.get(TestConfig)

        expect(entry).toEqual({
            base: TestConfig,
            dependencies: [],
            resolvedDependencies: [],
            propertyNameTranslations: {},
            instance: null
        })
    })

    it('does not overwrite an existing registry entry', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)

        const original = registry.get(TestConfig)

        registerConfigDefaults(TestConfig)

        expect(registry.get(TestConfig)).toBe(original)
    })

    it('extracts constructor dependencies from metadata', () => {
        class DepA {}
        class DepB {}

        const TestConfigWithDeps = class TestConfigWithDeps {} as Class

        Reflect.defineMetadata('design:paramtypes', [DepA, DepB], TestConfigWithDeps)

        registerConfigDefaults(TestConfigWithDeps)

        const entry = registry.get(TestConfigWithDeps)

        expect(entry?.dependencies).toEqual([DepA, DepB])
        expect(entry?.resolvedDependencies).toEqual([null, null])
    })
})

describe('registerConfigTransformOptions', () => {
    it('stores transform options on a registered config', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)
        registerConfigTransformOptions(TestConfig, { excludeExtraneousValues: true })

        const entry = registry.get(TestConfig)

        expect(entry?.transformOptions).toEqual({ excludeExtraneousValues: true })
    })

    it('throws if the config is not registered', () => {
        class UnregisteredConfig {}

        expect(() => registerConfigTransformOptions(UnregisteredConfig)).toThrow(
            'Failed to find registered config. Make sure to decorate a class with @Config()!'
        )
    })

    it('stores undefined transform options', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)
        registerConfigTransformOptions(TestConfig, undefined)

        const entry = registry.get(TestConfig)

        expect(entry?.transformOptions).toBeUndefined()
    })
})

describe('registerConfigTransformTranslations', () => {
    it('stores a property name translation', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)
        registerConfigTransformTranslations(TestConfig, 'environment', 'NODE_ENV')

        const entry = registry.get(TestConfig)

        expect(entry?.propertyNameTranslations).toEqual({
            environment: 'NODE_ENV'
        })
    })

    it('accumulates multiple translations', () => {
        class TestConfig {}

        registerConfigDefaults(TestConfig)
        registerConfigTransformTranslations(TestConfig, 'environment', 'NODE_ENV')
        registerConfigTransformTranslations(TestConfig, 'port', 'HTTP_PORT')

        const entry = registry.get(TestConfig)

        expect(entry?.propertyNameTranslations).toEqual({
            environment: 'NODE_ENV',
            port: 'HTTP_PORT'
        })
    })

    it('throws if the config is not registered', () => {
        class UnregisteredConfig {}

        expect(() => registerConfigTransformTranslations(UnregisteredConfig, 'prop', 'ENV_VAR')).toThrow(
            'Failed to find registered config. Make sure to decorate a class with @Config()!'
        )
    })
})

describe('getConfigInstance', () => {
    it('throws if config is not registered', () => {
        class UnregisteredConfig {}

        expect(() => getConfigInstance(UnregisteredConfig)).toThrow(
            'Failed to find registered config. Make sure to decorate a class with @Config()!'
        )
    })

    it('returns a cached instance on subsequent calls', () => {
        @Config()
        class CachedConfig {
            @IsOptional()
            @IsString()
            readonly SOME_VALUE: string = 'default'
        }

        const first = getConfigInstance(CachedConfig)
        const second = getConfigInstance(CachedConfig)

        expect(first).toBe(second)
    })

    it('caches the instance in the registry', () => {
        @Config()
        class CacheTestConfig {
            @IsOptional()
            @IsString()
            readonly VALUE: string = 'cached'
        }

        getConfigInstance(CacheTestConfig)

        const entry = registry.get(CacheTestConfig)

        expect(entry?.instance).not.toBeNull()
    })

    it('resolves a config with no dependencies', () => {
        @Config()
        class SimpleConfig {
            @IsOptional()
            @IsString()
            readonly SIMPLE_VALUE: string = 'hello'
        }

        const instance = getConfigInstance(SimpleConfig)

        expect(instance).toBeDefined()
        expect(instance.SIMPLE_VALUE).toBe('hello')
    })

    it('resolves config with @Env property name translation', () => {
        @Config()
        class EnvConfig {
            @IsEnum(NodeEnv)
            @Env('NODE_ENV')
            readonly environment: NodeEnv
        }

        const instance = getConfigInstance(EnvConfig)

        expect(instance.environment).toBeDefined()
    })

    it('throws ValidationException for invalid config', () => {
        @Config()
        class InvalidConfig {
            @IsInt()
            readonly DEFINITELY_NOT_SET_ENV_VAR: number
        }

        expect(() => getConfigInstance(InvalidConfig)).toThrow(ValidationException)
    })

    it('resolves constructor dependencies recursively', () => {
        @Config()
        class ParentConfig {
            @IsOptional()
            @IsString()
            readonly PARENT_VALUE: string = 'parent'
        }

        @Config()
        class ChildConfig {
            @IsOptional()
            @IsString()
            readonly CHILD_VALUE: string = 'child'

            constructor(readonly parent: ParentConfig) {}
        }

        const instance = getConfigInstance(ChildConfig)

        expect(instance.parent).toBeDefined()
        expect(instance.parent).toBeInstanceOf(ParentConfig)
        expect(instance.parent.PARENT_VALUE).toBe('parent')
    })

    it('auto-binds methods for destructuring support', () => {
        @Config()
        class MethodConfig {
            @IsOptional()
            @IsString()
            readonly METHOD_VALUE: string = 'bound'

            getValue() {
                return this.METHOD_VALUE
            }
        }

        const instance = getConfigInstance(MethodConfig)
        const { getValue } = instance

        expect(getValue()).toBe('bound')
    })

    it('reads environment variables from process.env', () => {
        process.env.TEST_MODULE_UTILS_VAR = 'from-process-env'

        @Config()
        class ProcessEnvConfig {
            @IsString()
            readonly TEST_MODULE_UTILS_VAR: string
        }

        const instance = getConfigInstance(ProcessEnvConfig)

        expect(instance.TEST_MODULE_UTILS_VAR).toBe('from-process-env')

        delete process.env.TEST_MODULE_UTILS_VAR
    })

    it('converts Number typed properties from env strings', () => {
        process.env.TEST_NUM_PROP = '9999'

        @Config()
        class NumConfig {
            @IsInt()
            readonly TEST_NUM_PROP: number
        }

        const instance = getConfigInstance(NumConfig)

        expect(instance.TEST_NUM_PROP).toBe(9999)

        delete process.env.TEST_NUM_PROP
    })
})
