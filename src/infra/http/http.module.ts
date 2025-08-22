import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@faker-js/faker";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController
    ],
    providers: [
        CreateQuestionUseCase
    ]
})
export class HttpModule { }