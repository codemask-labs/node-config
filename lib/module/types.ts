import { ClassTransformOptions } from 'class-transformer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<TConstructor = any> = new (...args: Array<any>) => TConstructor

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer T) => void ? T : never

export type Flatten<T> = T extends ReadonlyArray<infer Item> ? (Item extends Class ? InstanceType<Item> : Item) : T

export type ConfigMap = Map<Class, InstanceType<Class>>

export type ConfigServiceExceptionOptions = {
    stack?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructors<T extends Array<any>> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T[K] extends new (...args: Array<any>) => infer U ? U : never
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Reduce<T extends Array<any>> = T extends [infer U, ...infer Rest] ? U & Reduce<Rest> : {}

export type RegisteredConfig = {
    constructor: Class
    dependencies: Array<Class>
    resolvedDependencies: Array<null | object>
    propertyNameTranslations: Record<string, string>
    transformOptions?: ClassTransformOptions
    instance: null | object
}
