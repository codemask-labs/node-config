import { Class } from 'lib/common'

export const useConfig = <T, R>(config: Class<T>, pick?: (config: T) => R): typeof pick extends undefined ? T : R =>
    pick ? pick(new config()) : new config()
