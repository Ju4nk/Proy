import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Importa tus módulos de la aplicación
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // Carga de variables de entorno en toda la aplicación
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Asegúrate de que esté en la raíz del proyecto
    }),
    // Configuración asíncrona de TypeORM utilizando las variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'Error444',
        database: configService.get<string>('DB_NAME') || 'notes_app_nueva',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // En desarrollo; en producción, considera usar migrations
        logging: true,     // Activa el logging para ver las queries en la consola
        logger: 'advanced-console',
      }),
    }),
    // Configuración asíncrona de JWT utilizando JWT_SECRET
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'clave-super-segura',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // Importa tus módulos de la aplicación
    AuthModule,
    UsersModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}