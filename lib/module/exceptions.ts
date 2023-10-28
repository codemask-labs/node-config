import { ConfigServiceError } from './errors'

export type ConfigServiceExceptionOptions = {
    stack?: string
}

export class ConfigServiceException extends Error {
    constructor(error: ConfigServiceError, options?: ConfigServiceExceptionOptions) {
        super(error)

        if (options && options.stack) {
            this.stack = options.stack
        }
    }
}
