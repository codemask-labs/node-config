// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toValueByType = (type: any, value: string) => {
    switch (type) {
        case Boolean: {
            return value === 'true' || Boolean(value)
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
