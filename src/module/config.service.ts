import { validate } from 'class-validator'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Config, ConfigMap, ConfigServiceOptions } from './types'
import { getConfigMap } from './utils'

@Injectable()
export class ConfigService implements OnModuleInit {
    private readonly options: ConfigServiceOptions
    private readonly configMap: ConfigMap

    constructor(config: Config | Array<Config>, options: ConfigServiceOptions = {}) {
        const { parent, transform } = options

        this.options = options
        this.configMap = getConfigMap(config, {
            base: parent?.getConfigMap(),
            transform
        })
    }

    get<T>(config: Config<T>): T {
        if (!this.configMap.has(config)) {
            throw new Error(
                `Config (${config.name}) is not found or has not been registered correctly using ConfigModule.forRoot() or ConfigModule.forFeature()`
            )
        }

        return this.configMap.get(config)
    }

    getConfigMap() {
        console.log('getting config map')

        return this.configMap
    }

    getOptions() {
        return this.options
    }

    async onModuleInit() {
        const validators = await Promise.allSettled(
            [...this.configMap.values()].map(async config => {
                const validationErrors = await validate(config, this.options.validator)

                if (validationErrors.length) {
                    throw new Error(validationErrors.map(error => error.toString()).join('\r'))
                }
            })
        )

        const errors = validators.map(validator => validator.status === 'rejected' ? validator.reason as Error : null).filter(Boolean) as Array<Error>

        if (errors.length) {
            throw new Error(`ConfigService failed to validate config:\r${errors.join('\r')}`)
        }
    }
}
