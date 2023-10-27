import { mergeAll, pickAll } from 'ramda'
import { config as dotenv } from 'dotenv'
import { ClassTransformOptions, plainToInstance } from 'class-transformer'
import { Config, ConfigMap, ConfigMapOptions } from './types'

const transformConfigEntry = <T>(config: Config<T>, options?: ClassTransformOptions): T => {
    const instance = new config()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keys = Object.keys(instance as Record<string, any>)
    const { parsed } = dotenv()
    const env = pickAll(keys, mergeAll([{}, process.env, parsed]))

    return plainToInstance(config, env, {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
        ...options
    })
}

const transformConfigEntries = (config: Config | Array<Config>, transformOptions?: ClassTransformOptions): Array<[Config, InstanceType<Config>]> =>
    (Array.isArray(config) ? config : [config]).map(constructor => [constructor, transformConfigEntry(constructor, transformOptions)])

export const createConfigMap = (config: Config | Array<Config>, options: ConfigMapOptions = {}): ConfigMap => {
    const { base, transform } = options
    const entries = transformConfigEntries(config, transform)

    if (base) {
        const configsWithBase = [...base.entries(), ...entries]

        return new Map(configsWithBase)
    }

    return new Map(entries)
}
