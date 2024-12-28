import { yellow, red, gray, blue } from 'chalk'
import { ValidationError } from 'class-validator'

export class ValidationException extends Error {
    constructor(name: string, validationErrors: Array<ValidationError>) {
        const failedConstraints = validationErrors
            .map(error => {
                const [constraint] = Object.values(error.constraints ?? {})
                const message = constraint || `${error.property} failed for unknown reason or constraint`

                return gray(`- ${message} ${blue(`(was: ${error.value || 'undefined'})`)}`)
            })
            .join('\r\n')

        super(`${yellow(`[ValidationException]`)} ${red(`Failed for config [${name}] with following constraints:`)}\r\n${failedConstraints}`)

        this.stack = undefined
    }
}
