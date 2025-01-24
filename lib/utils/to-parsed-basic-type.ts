// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toParsedBasicType = (type: any, value: string) => {
    switch (type) {
        case Boolean: {
            return Boolean(value === 'true')
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
