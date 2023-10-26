import { IsBase64, IsBoolean, IsInt, IsString } from 'class-validator'

export class MailerConfig {
    @IsString()
    readonly MAILER_HOST: string

    @IsInt()
    readonly MAILER_PORT: number

    @IsString()
    readonly MAILER_FROM: string

    @IsBoolean()
    readonly MAILER_SECURE: boolean

    @IsString()
    readonly MAILER_AUTH_EMAIL: string

    @IsString()
    readonly MAILER_AUTH_PASSWORD: string

    @IsBase64()
    readonly EXPECTED_A_BASE64_BUT_IT_WILL_BE_EMPTY: string
}
