import { Class } from 'lib/common'
import { ConfigRegistry } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const getConfigValue = <T extends Class<any>, U>(constructor: T, getter: (config: InstanceType<T>) => U) => {
    const instance = ConfigRegistry.getConfigInstance(constructor)

    if (!instance) {
        throw new Error('Failed to find instance')
    }

    return getter(instance as InstanceType<T>)
}
