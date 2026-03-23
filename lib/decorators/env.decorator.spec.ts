import { registry } from 'lib/module/constants'
import { Config } from './config.decorator'
import { Env } from './env.decorator'

beforeEach(() => {
    registry.clear()
})

describe('@Env decorator', () => {
    it('registers property name translation', () => {
        @Config()
        class EnvTestConfig {
            @Env('NODE_ENV')
            readonly environment: string
        }

        const entry = registry.get(EnvTestConfig)

        expect(entry?.propertyNameTranslations).toEqual({
            environment: 'NODE_ENV'
        })
    })

    it('registers multiple property name translations', () => {
        @Config()
        class MultiEnvConfig {
            @Env('APP_HOST')
            readonly host: string

            @Env('APP_PORT')
            readonly port: number
        }

        const entry = registry.get(MultiEnvConfig)

        expect(entry?.propertyNameTranslations).toEqual({
            host: 'APP_HOST',
            port: 'APP_PORT'
        })
    })

    it('registers the class in the registry if not already registered', () => {
        // @Env calls registerConfigDefaults internally
        class ImplicitConfig {
            @Env('SOME_VAR')
            readonly value: string
        }

        expect(registry.has(ImplicitConfig)).toBe(true)
    })
})
