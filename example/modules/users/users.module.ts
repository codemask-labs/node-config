import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from 'lib/module'
import { TypeormConfig } from 'example/config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [
                ConfigModule.forFeature({
                    config: TypeormConfig
                })
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { TYPEORM_CONNECTION, TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE, TYPEORM_LOGGING } = configService.get(TypeormConfig)

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
