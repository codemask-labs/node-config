// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<TConstructor = any> = new (...args: Array<any>) => TConstructor

export type ConfigMap = Map<Class, InstanceType<Class>>

export type ConfigServiceExceptionOptions = {
    stack?: string
}
