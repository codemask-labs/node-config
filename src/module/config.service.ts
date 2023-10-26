import { validateSync } from 'class-validator'
import { Config, ConfigMap, ConfigServiceOptions } from './types'
import { createConfigMap } from './utils'

export class ConfigService {
    private readonly options: ConfigServiceOptions
    private readonly configMap: ConfigMap

    constructor(config: Config | Array<Config>, options: ConfigServiceOptions = {}) {
        const { parent: parent, transform } = options

        this.options = options
        this.configMap = createConfigMap(config, {
            base: parent?.configMap,
            transform
        })

        this.runConfigValidations()
    }

    get<T>(config: Config<T>): T {
        if (!this.configMap.has(config)) {
            throw new Error(
                `Config (${config.name}) is not found or has not been registered correctly using ConfigModule.forRoot() or ConfigModule.forFeature()`
            )
        }

        return this.configMap.get(config)
    }

    private runConfigValidations() {
        const configs = [...this.configMap.values()]
        const validationErrors = configs.reduce<Array<Error>>((errors, config) => {
            const validationErrors = validateSync(config, this.options.validator)

            if (!validationErrors.length) {
                return errors
            }

            return [...errors, new Error(validationErrors.map(error => error.toString()).join('\r'))]
        }, [])

        if (validationErrors.length) {
            throw new Error(`ConfigService failed to validate config:\r${validationErrors.join('\r')}`)
        }
    }
}
