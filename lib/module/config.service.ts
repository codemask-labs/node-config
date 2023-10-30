import { mergeAll, pickAll } from 'ramda'
import { validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { config as dotenv } from 'dotenv'
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

    private getConfigEntry(config: Class) {
        const { parsed } = dotenv()
        const { overrides } = this.options
        const { options: { transformOptions } } = this.options.parent || this

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keys = Object.keys(new config() as Record<string, any>)
        const env = pickAll(keys, overrides || mergeAll([{}, process.env, parsed]))

        return plainToInstance(config, env, {
            enableImplicitConversion: true,
            exposeDefaultValues: true,
            ...transformOptions
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getConfigEntries(config: Array<Class>): Array<[Class, any]> {
        return config.map(constructor => [constructor, this.getConfigEntry(constructor)])
    }

    private getConfigMap(config: Array<Class>): ConfigMap {
        const { parent } = this.options
        const entries = this.getConfigEntries(config)

        if (parent) {
            const configsWithBase = [...parent.configMap.entries(), ...entries]

            return this.validate(new Map(configsWithBase))
        }

        return this.validate(new Map(entries))
    }

    private validate(configMap: ConfigMap) {
        const { options: { validatorOptions } } = this.options.parent || this

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
