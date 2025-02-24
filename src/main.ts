import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { JwtAuthGuard } from './controllers/auth/jwt-auth.guard';
import { ProjectMembersService } from './controllers/project/project-members.service';
import { ProjectMemberGuard } from './controllers/project/guards/project-member.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const projectMembersService = app.get(ProjectMembersService);
  // app.useGlobalGuards(
  //   new JwtAuthGuard(),
  //   new ProjectMemberGuard(projectMembersService),
  // );
  app.setGlobalPrefix('api', {});
  const config = new DocumentBuilder()
    .setTitle('GTP')
    .setDescription('GTP API Documentation')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use(
    '/api/documentation',
    apiReference({
      spec: {
        content: documentFactory,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
