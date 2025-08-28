import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";

@Module({
    providers: [PrismaService,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswersRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionsRepository,
        PrismaQuestionCommentsRepository,
    ],
    exports: [ PrismaService]
})
export class DatabaseModule {}
