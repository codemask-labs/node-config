import { pickAll } from 'ramda'
import { ClassTransformOptions, plainToInstance } from 'class-transformer'
import { Config, ConfigMap, ConfigMapOptions } from './types'

const getTransformedConfigEntry = <T>(config: Config<T>, options?: ClassTransformOptions): T => {
    const instance = new config()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keys = Object.keys(instance as Record<string, any>)
    const env = pickAll(keys, process.env)

    return plainToInstance(config, env, {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
        ...options
    })
}

const getTransformedConfigEntries = (config: Config | Array<Config>, transform?: ClassTransformOptions): Array<[Config, InstanceType<Config>]> => {
    const configs = Array.isArray(config) ? config : [config]

    return configs.map(constructor => [constructor, getTransformedConfigEntry(constructor, transform)])
}

export const getConfigMap = (config: Config | Array<Config>, options: ConfigMapOptions = {}): ConfigMap => {
    const { base, transform } = options
    const entries = getTransformedConfigEntries(config, transform)

    if (base) {
        const configsWithBase = [...base.entries(), ...entries]

        return new Map(configsWithBase)
    }

    return new Map(entries)
}
