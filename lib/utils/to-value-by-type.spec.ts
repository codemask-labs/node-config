import { toValueByType } from './to-value-by-type'

describe('toValueByType', () => {
    describe('Boolean type', () => {
        it('returns true for "true"', () => {
            expect(toValueByType(Boolean, 'true')).toBe(true)
        })

        it('returns true for "1"', () => {
            expect(toValueByType(Boolean, '1')).toBe(true)
        })

        it('returns false for "false"', () => {
            expect(toValueByType(Boolean, 'false')).toBe(false)
        })

        it('returns false for "0"', () => {
            expect(toValueByType(Boolean, '0')).toBe(false)
        })

        it('returns false for an arbitrary string', () => {
            expect(toValueByType(Boolean, 'yes')).toBe(false)
        })

        it('returns false for an empty string', () => {
            expect(toValueByType(Boolean, '')).toBe(false)
        })
    })

    describe('Number type', () => {
        it('converts an integer string', () => {
            expect(toValueByType(Number, '42')).toBe(42)
        })

        it('converts a float string', () => {
            expect(toValueByType(Number, '3.14')).toBeCloseTo(3.14)
        })

        it('converts a negative number string', () => {
            expect(toValueByType(Number, '-10')).toBe(-10)
        })

        it('returns NaN for a non-numeric string', () => {
            expect(toValueByType(Number, 'abc')).toBeNaN()
        })

        it('converts "0" to 0', () => {
            expect(toValueByType(Number, '0')).toBe(0)
        })
    })

    describe('String type', () => {
        it('returns the value as-is', () => {
            expect(toValueByType(String, 'hello')).toBe('hello')
        })

        it('returns an empty string as-is', () => {
            expect(toValueByType(String, '')).toBe('')
        })
    })

    describe('default (unknown type)', () => {
        it('returns the value as-is for an unknown type', () => {
            expect(toValueByType(Date, 'some-value')).toBe('some-value')
        })

        it('returns the value as-is for undefined type', () => {
            expect(toValueByType(undefined, 'some-value')).toBe('some-value')
        })
    })
})
