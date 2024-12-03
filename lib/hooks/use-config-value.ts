import { Class } from 'lib/common'
import { Constructors, Reduce } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useConfigValue = <T extends Class<any>, U>(config: T, getter: (config: Reduce<Constructors<[T]>>) => U) => null as U
