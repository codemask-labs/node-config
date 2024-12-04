import { ClassTransformOptions } from 'class-transformer'
import { Class } from './types'
import { CONFIG_WATERMARK } from './constants'

type RegisteredConfig = {
    dependencies: Array<Class>
    resolvedDependencies: Array<object | null>
    transformOptions?: ClassTransformOptions
    instance: null | object
}

export class ConfigRegistry {
    static registered = new Map<Class, RegisteredConfig>()

    static register(config: Class, transformOptions?: ClassTransformOptions) {
        if (this.registered.has(config)) {
            return
        }

        const dependencies: Array<Class> = Reflect.getMetadata('design:paramtypes', config) || []

        Reflect.defineMetadata(CONFIG_WATERMARK, true, config)

        this.registered.set(config, {
            dependencies,
            resolvedDependencies: dependencies.map(() => null),
            transformOptions,
            instance: null
        })
    }
}
