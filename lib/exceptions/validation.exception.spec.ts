import { ValidationError } from 'class-validator'
import { ValidationException } from './validation.exception'

describe('ValidationException', () => {
    it('formats a single validation error with constraint', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'PORT',
                constraints: { isInt: 'PORT must be an integer number' },
                value: 'abc',
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('TestConfig', errors)

        expect(exception).toBeInstanceOf(Error)
        expect(exception.message).toContain('TestConfig')
        expect(exception.message).toContain('PORT must be an integer number')
        expect(exception.message).toContain('was: abc')
    })

    it('formats multiple validation errors', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'HOST',
                constraints: { isString: 'HOST must be a string' },
                value: undefined,
                target: {},
                children: []
            },
            {
                property: 'PORT',
                constraints: { isInt: 'PORT must be an integer number' },
                value: 'invalid',
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('AppConfig', errors)

        expect(exception.message).toContain('HOST must be a string')
        expect(exception.message).toContain('was: undefined')
        expect(exception.message).toContain('PORT must be an integer number')
        expect(exception.message).toContain('was: invalid')
    })

    it('handles empty string constraint with a fallback message', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'UNKNOWN_PROP',
                constraints: { custom: '' },
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('TestConfig', errors)

        expect(exception.message).toContain('UNKNOWN_PROP failed for unknown reason or constraint')
    })

    it('handles undefined constraints gracefully', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'PROP',
                constraints: undefined,
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('TestConfig', errors)

        expect(exception.message).toContain('TestConfig')
    })

    it('shows "was: undefined" for missing values', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'REQUIRED_PROP',
                constraints: { isDefined: 'REQUIRED_PROP should not be empty' },
                value: undefined,
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('TestConfig', errors)

        expect(exception.message).toContain('was: undefined')
    })

    it('clears the stack trace', () => {
        const errors: Array<ValidationError> = [
            {
                property: 'PORT',
                constraints: { isInt: 'PORT must be an integer' },
                value: 'abc',
                target: {},
                children: []
            }
        ]

        const exception = new ValidationException('TestConfig', errors)

        expect(exception.stack).toBeUndefined()
    })
})
