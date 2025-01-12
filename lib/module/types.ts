/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassTransformOptions } from 'class-transformer'

export type Class<T = any> = new (...args: Array<any>) => T

export type ConfigServiceExceptionOptions = {
    stack?: string
}

export type Constructors<T extends Array<any>> = {
    [K in keyof T]: T[K] extends new (...args: Array<any>) => infer U ? U : never
}

export type ConfigInstance<T extends Array<any>> = T extends [infer U, ...infer Rest] ? { [K in keyof U]: U[K] } & ConfigInstance<Rest> : {}

export type RegisteredConfig = {
    base: Class
    dependencies: Array<Class>
    resolvedDependencies: Array<any>
    propertyNameTranslations: Record<string, string>
    transformOptions?: ClassTransformOptions
    instance: any
}
