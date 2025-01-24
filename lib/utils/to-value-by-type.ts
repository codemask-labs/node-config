// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toValueByType = (type: any, value: string) => {
    switch (type) {
        case Boolean: {
            return Boolean(value === 'true' || value === '1')
        }

        case Number: {
            return Number(value)
        }

        case String:
        default: {
            return value
        }
    }
}
