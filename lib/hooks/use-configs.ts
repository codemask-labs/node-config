import { Class } from 'lib/common'

export const useConfigs = <T, R>(config: [...Class<T>], pick: (configs: T) => R) => pick(new config())
