import { Class } from 'lib/common'
import { Constructors, Reduce } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useConfigs = <T extends Array<Class<any>>>(...configs: [...T]) => ({}) as Reduce<Constructors<T>>
