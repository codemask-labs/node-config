import { validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigServiceError } from './errors'
import { ConfigServiceException } from './exceptions'
import { Class, ConfigMap } from './types'
import { getInstanceProperties } from './utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer T) => void)
    ? T
    : never

type Flatten<T> = T extends ReadonlyArray<infer Item>
    ? Item extends Class ? InstanceType<Item> : Item
    : T

@Injectable()
export class ConfigService {
    private readonly logger = new Logger(ConfigService.name)

    constructor(
        @Inject('GLOBAL_CONFIG_MAP')
        private readonly configs: ConfigMap,
        @Inject('GLOBAL_ENVIRONMENT_VARIABLES')
        private readonly envs: Record<string, string>
    ) {}

    add(providers: Array<Class>) {
        providers.forEach(provider => {
            if (!this.configs.has(provider)) {
                const instance = plainToInstance(provider, this.envs, {
                    enableImplicitConversion: true,
                    exposeDefaultValues: true
                })

                this.configs.set(provider, instance)
            }
        })

        return this
    }

    get<Config>(provider: Class<Config>) {
        const config = this.configs.get(provider)

        if (!config) {
            throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
        }

        return config as Config
    }

    value<Config, Key extends keyof Config>(provider: Class<Config>, key: Key, defaultValue?: Config[Key]) {
        const config = this.configs.get(provider)

        if (!config) {
            throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
        }

        return defaultValue || config[key] as Config[typeof key]
    }

    values<Providers extends Array<Class>>(...providers: Providers) {
        return providers.reduce(
            (values, provider) => {
                const config = this.configs.get(provider)

                if (!config) {
                    throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
                }

                const properties = getInstanceProperties(config)

                return {
                    ...values,
                    ...properties
                }
            },
            {}
        ) as UnionToIntersection<Flatten<Providers>>
    }

    override<Config>(provider: Class<Config>, overrides?: Partial<Config>) {
        const config = this.configs.get(provider)

        if (!config) {
            throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
        }

        // eslint-disable-next-line functional/immutable-data
        return Object.assign(config, overrides || {}) as Config
    }

    validate<Config>(providers: Array<Class<Config>>) {
        const validations = providers.map(provider => {
            const config = this.configs.get(provider)

            if (!config) {
                throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
            }

            return {
                provider,
                errors: validateSync(config)
            }
        })

        if (validations.some(config => config.errors.length)) {
            validations.forEach(config => {
                if (!config.errors.length) {
                    return
                }

                this.logger.error(`Failed to validate config [class ${config.provider.name}]:`)

                config.errors.forEach(error =>
                    Object.entries(error.constraints || {}).forEach(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ([_, message]) => {
                            this.logger.error(`\x1b[31m└─ \x1b[90m${message} (found: ${error.value})\x1b[0m`)
                        }
                    )
                )
            })

            throw new ConfigServiceException(ConfigServiceError.CONFIG_VALIDATION_ERRORS)
        }
    }

    getConfigs() {
        return this.configs
    }
}
