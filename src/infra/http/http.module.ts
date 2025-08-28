import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";

@Module({
    
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
    imports: [AuthModule, DatabaseModule]

})
export class HttpModule { }

