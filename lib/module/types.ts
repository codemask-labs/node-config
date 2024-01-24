// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<TConstructor = any> = new (...args: Array<any>) => TConstructor

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer T) => void ? T : never

export type Flatten<T> = T extends ReadonlyArray<infer Item> ? (Item extends Class ? InstanceType<Item> : Item) : T

export type ConfigMap = Map<Class, InstanceType<Class>>

export type ConfigServiceExceptionOptions = {
    stack?: string
}
