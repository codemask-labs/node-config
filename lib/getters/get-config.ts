import { Constructors, ConfigInstance, getConfigInstance, Class } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConfig = <T extends Class<any>>(constructor: T) => getConfigInstance(constructor) as ConfigInstance<Constructors<[T]>>
