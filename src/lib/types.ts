import { ClassTransformOptions } from 'class-transformer'
import { ValidatorOptions } from 'class-validator'
import { ConfigService } from 'module/config.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config<TConstructor = any> = new (...args: Array<any>) => TConstructor
export type ConfigMap = Map<Config, InstanceType<Config>>

export type ConfigModuleRootOptions = {
    global?: boolean
    config: Config | Array<Config>
}

export type ConfigModuleFeatureOptions = {
    config: Config | Array<Config>
}

export type ConfigServiceOptions = {
    parent?: ConfigService
    transform?: ClassTransformOptions
    validator?: ValidatorOptions
}

export type ConfigMapOptions = {
    base?: ConfigMap
    transform?: ClassTransformOptions
}
