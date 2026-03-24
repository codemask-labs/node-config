import { registry } from 'lib/module/constants'
import { Config } from './config.decorator'

beforeEach(() => {
    registry.clear()
})

describe('@Config decorator', () => {
    it('registers a class in the registry', () => {
        @Config()
        class TestConfig {}

        expect(registry.has(TestConfig)).toBe(true)
    })

    it('sets default registry entry fields', () => {
        @Config()
        class DefaultsConfig {}

        const entry = registry.get(DefaultsConfig)

        expect(entry?.base).toBe(DefaultsConfig)
        expect(entry?.dependencies).toEqual([])
        expect(entry?.resolvedDependencies).toEqual([])
        expect(entry?.propertyNameTranslations).toEqual({})
        expect(entry?.instance).toBeNull()
    })

    it('stores transform options when provided', () => {
        @Config({ toClassOnly: true })
        class TransformConfig {}

        const entry = registry.get(TransformConfig)

        expect(entry?.transformOptions).toEqual({ toClassOnly: true })
    })

    it('stores undefined transform options when none provided', () => {
        @Config()
        class NoTransformConfig {}

        const entry = registry.get(NoTransformConfig)

        expect(entry?.transformOptions).toBeUndefined()
    })
})
