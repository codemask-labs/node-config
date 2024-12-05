import { Class } from 'lib/common'
import { ConfigRegistry, Constructors, Reduce } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useConfig = <T extends Class<any>>(constructor: T) => ConfigRegistry.getConfigInstance(constructor) as Reduce<Constructors<[T]>>
