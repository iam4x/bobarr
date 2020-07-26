import { NestFactory } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { UI } from "bull-board";

import { AppModule } from "./app.module";
import { winstonOptions } from "./utils/winston-options";

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonOptions);
  const app = await NestFactory.create(AppModule, { logger });
  app.use("/jobs", UI);
  await app.listen(4000);
}
bootstrap();
