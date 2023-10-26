import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormConfig } from 'lib/config'
import { ConfigModule } from 'module/config.module'
import { ConfigService } from 'module/config.service'

@Module({
    imports: [
        ConfigModule.forFeature({
            config: TypeormConfig
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log(configService)

                const { TYPEORM_CONNECTION, TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE, TYPEORM_LOGGING } = configService.get(TypeormConfig)

                console.log(TYPEORM_CONNECTION)

                return {
                    type: TYPEORM_CONNECTION,
                    host: TYPEORM_HOST,
                    port: TYPEORM_PORT,
                    username: TYPEORM_USERNAME,
                    password: TYPEORM_PASSWORD,
                    database: TYPEORM_DATABASE,
                    entities: Object.values({}),
                    migrations: Object.values({}),
                    synchronize: false,
                    migrationsRun: true,
                    autoLoadEntities: true,
                    logging: TYPEORM_LOGGING ? 'all' : undefined
                }
            }
        })
    ]
})
export class UsersModule {}
