import { ClassTransformOptions } from 'class-transformer'
import { ValidatorOptions } from 'class-validator'
import { ConfigService } from './config.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<TConstructor = any> = new (...args: Array<any>) => TConstructor

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type Provides<TProvides extends Array<Class>> = [...TProvides]

export type Overrides<TProvides extends Array<Class>> = TProvides extends [a: Class<infer A>, ...rest: infer R]
    ? R extends Array<Class>
        ? { [Key in keyof A]: A[Key] } & Overrides<R>
        : never
    : object

export type ConfigMap = Map<Class, InstanceType<Class>>

export type ConfigModuleRootOptions<TProvides extends Array<Class>> = {
    provides: Provides<TProvides>
    global?: boolean
    overrides?: Expand<Overrides<TProvides>>
    transformOptions?: ClassTransformOptions
    validatorOptions?: ValidatorOptions
}

export type ConfigModuleFeatureOptions<TProvides extends Array<Class>> = {
    provides: Array<Class>
    overrides?: Expand<Overrides<TProvides>>
}

export type ConfigServiceOptions = {
    parent?: ConfigService
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overrides?: Record<string, any>
    transformOptions?: ClassTransformOptions
    validatorOptions?: ValidatorOptions
}

export type ConfigServiceExceptionOptions = {
    stack?: string
}
