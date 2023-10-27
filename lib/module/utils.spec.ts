import { createConfigMap } from './utils'
import { ConfigMock, NodeEnv, OtherConfigMock } from 'lib/module/mocks'

describe('Utils', () => {
    it('createConfigMap returns a one mapped entry from config', () => {
        const result = createConfigMap(ConfigMock)
        const expected = new Map([[ConfigMock, expect.objectContaining({ NODE_ENV: NodeEnv.Test })]])

        expect(result).toEqual(expected)
    })

    it('createConfigMap returns a one mapped entry from many same configs', () => {
        const result = createConfigMap([ConfigMock, ConfigMock, ConfigMock, OtherConfigMock])
        const expected = new Map([
            [ConfigMock, expect.objectContaining({ NODE_ENV: NodeEnv.Test })],
            [OtherConfigMock, expect.objectContaining({ NODE_ENV: NodeEnv.Test, HELLO_WORLD: 'foo' })]
        ])

        expect(result).toEqual(expected)
    })
})
