import { ConfigServiceExceptionOptions } from './types'

export class ConfigServiceException extends Error {
    constructor(message: string, options?: ConfigServiceExceptionOptions) {
        super(message)

        if (options && options.stack) {
            this.stack = options.stack
        }
    }
}
