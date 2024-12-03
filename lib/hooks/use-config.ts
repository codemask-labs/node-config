import { Class } from 'lib/common'
import { Constructors, Reduce } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useConfig = <T extends Class<any>>(config: T) => ({}) as Reduce<Constructors<[T]>>
