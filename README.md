# Codemask Nestjs Config Module

## How to Install

### Required peer dependencies

> [!NOTE]
> If your project already uses @nestjs/common, class-validator and/or class-transformer - then skip installing mentioned peer dependencies.

```bash
$ yarn add @nestjs/common class-validator class-transformer
```

### Adding package to your project
```bash
$ yarn add @codemaskjs/nestjs-config
```

## Configuration

### Configuring ConfigModule for root

For providing globally available configs, use the example from below:

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@codemaskjs/nestjs-config'

@Module({
    imports: [
        ConfigModule.forRoot()
        // or
        ConfigModule.forRoot([<your config class>, ...])
        // or
        ConfigModule.forFeature([<your config class>, ...])
        // or
        ConfigModule.forTest(<your config class>, <optional and partial overrides>)
    ]
})
export class MailerModule {}
```

## Examples

1. Config Class

To be updated

2. Config Module

### Using `forRoot`

To be updated

### Using `forFeature`

To be updated

### Using `forFeature` with `TypeOrm`

3. Config Service

To be updated
