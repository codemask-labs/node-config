import { pickAll } from 'ramda'
import { config, parse } from 'dotenv'
import { validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { ValueProvider } from '@nestjs/common'
import { Class, ConfigMap, ConfigServiceOptions, ConfigValidationError } from './types'
import { ConfigServiceException } from './exceptions'
import { ConfigServiceError } from './errors'

export class ConfigService {
    private readonly configMap: ConfigMap

    constructor(
        provides: Array<Class>,
        private readonly options: ConfigServiceOptions = {}
    ) {
        this.configMap = this.getConfigMap(provides)
    }

    get<T>(config: Class<T>): T {
        if (!this.configMap.has(config)) {
            throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${config.name}]`)
        }

        return this.configMap.get(config)
    }

    getProviders(): Array<ValueProvider> {
        return [...this.configMap.entries()].map(([token, config]) => ({ provide: token, useValue: config }))
    }

    private getTransformedConfig(constructor: Class) {
        const {
            options: { transformOptions, overrides = {} }
        } = this.options.parent || this

        const mappedEnvs = Object.entries(process.env)
            .map(([key, value]) => `${key}="${value}"`)
            .join('\n')

        const { parsed: fileEnvs = {} } = config()
        const processEnvs = parse(mappedEnvs)
        const availableFields = Object.getOwnPropertyNames(new constructor())
        const env = pickAll(availableFields, { ...processEnvs, ...fileEnvs, ...overrides })

        return plainToInstance(constructor, env, {
            enableImplicitConversion: true,
            exposeDefaultValues: true,
            ...transformOptions
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getTransformedConfigs(config: Array<Class>): Array<[Class, any]> {
        return config.map(constructor => [constructor, this.getTransformedConfig(constructor)])
    }

    private getConfigMap(config: Array<Class>): ConfigMap {
        const { parent } = this.options
        const entries = this.getTransformedConfigs(config)

        if (parent) {
            return this.validate(new Map([...parent.configMap.entries(), ...entries]))
        }

        return this.validate(new Map(entries))
    }

    private validate(configMap: ConfigMap) {
        const {
            options: { validatorOptions }
        } = this.options.parent || this

        const configs = [...configMap.values()]
        const validationErrors = configs.reduce<Array<ConfigValidationError>>((errors, config) => {
            const validationErrors = validateSync(config, validatorOptions)

            if (!validationErrors.length) {
                return errors
            }

            return [...errors, { config, validationErrors }]
        }, [])

        if (validationErrors.length) {
            throw new ConfigServiceException(ConfigServiceError.CONFIG_VALIDATION_ERRORS, {
                stack: validationErrors.reduce((formattedStack, { config, validationErrors }) => {
                    formattedStack += `Failed to validate config: [class ${config.constructor.name}]\r\n`
                    formattedStack += validationErrors
                        .map(error =>
                            Object.entries(error.constraints || {}).map(
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                ([_, message]) => `\x1b[31m└─ \x1b[90m${message} (found: ${error.value})\x1b[0m`
                            )
                        )
                        .join('\r\n')

                    return formattedStack
                }, '')
            })
        }

        return configMap
    }
}
