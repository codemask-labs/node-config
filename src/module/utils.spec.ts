import { getConfigMap } from './utils'
import { ConfigMock, NodeEnv } from 'module/mocks'

describe('Utils', () => {
    it('getConfigMap returns a one mapped entry from config', () => {
        const result = getConfigMap(ConfigMock)
        const expected = new Map([
            [ConfigMock, expect.objectContaining({ NODE_ENV: NodeEnv.Test })]
        ])

        expect(result).toEqual(expected)
    })

    it('getConfigMap returns a one mapped entry from many same configs', () => {
        const result = getConfigMap([
            ConfigMock,
            ConfigMock,
            ConfigMock
        ])
        const expected = new Map([
            [ConfigMock, expect.objectContaining({ NODE_ENV: NodeEnv.Test })]
        ])

        expect(result).toEqual(expected)
    })
})
