import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const PostgresDbConfig: PostgresConnectionOptions = {
    type: 'postgres',

    // -- DB CONFIG
    host: process.env.DB_HOST != null ? process.env.DB_HOST : '192.168.56.1',
    username: process.env.DB_USERNAME != null ? process.env.DB_USERNAME : 'test',
    password: process.env.DB_PASSWORD != null ? process.env.DB_PASSWORD : '12345',
    database: process.env.DB_NAME != null ? process.env.DB_NAME : 'blitz',
    port: +(process.env.DB_PORT != null ? process.env.DB_PORT : 5432),

    // -- ORM CONFIG
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    // autoLoadEntities: true,
    migrationsRun: true,
    synchronize: false
};
