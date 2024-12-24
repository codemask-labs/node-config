import { Class } from 'lib/common'
import { ConfigRegistry, Constructors, Reduce } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useConfigs = <T extends Array<Class<any>>>(...constructors: [...T]) =>
    constructors.reduce(
        (acc, constructor) => {
            const instance = ConfigRegistry.getConfigInstance(constructor)

            return {
                ...acc,
                ...instance
            }
        },
        {} as Reduce<Constructors<T>>
    )
