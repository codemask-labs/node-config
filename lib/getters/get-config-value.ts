import { Class, getConfigInstance } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConfigValue = <T extends Class<any>, U>(constructor: T, getter: (config: InstanceType<T>) => U) => {
    const instance = getConfigInstance(constructor)

    if (instance === null || instance === undefined) {
        throw new Error('Failed to find instance')
    }

    return getter(instance as InstanceType<T>)
}
