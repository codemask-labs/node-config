import { validate } from 'class-validator'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Config, ConfigMap, ConfigServiceOptions } from 'lib/types'
import { getConfigMap } from 'lib/utils'

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
                `Config (${config}) is not found or has not been registered correctly using ConfigModule.forRoot() or ConfigModule.forFeature()`
            )
        }

        return this.configMap.get(config)
    }

    getConfigMap() {
        return this.configMap
    }

    getOptions() {
        return this.options
    }

    async onModuleInit() {
        // Q: Since the Map.entries() returns iterator, is it better idea to use a loop here?
        // Probably, not, but else is not considered "hacky"?
        // eslint-disable-next-line no-loops/no-loops
        for (const entry of this.configMap.entries()) {
            const [token, config] = entry
            const validationErrors = await validate(config, this.options.validator)

            if (validationErrors.length) {
                throw new Error(`${token}: ${validationErrors.map(error => error.toString())}`)
            }
        }
    }
}
