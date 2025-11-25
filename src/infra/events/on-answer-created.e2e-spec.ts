
import { INestApplication } from '@nestjs/common'
import { AppModule } from 'src/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { waitFor } from 'test/utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'

describe('On answer created e2e', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        
        DomainEvents.shouldRun = true

        await app.init()
    })

    it('should send a notification when an answer is created', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const questionId = question.id.toString()

        await request(app.getHttpServer())
            .post(`/questions/${questionId}/answers`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: 'New Answer',
                attachments: []
            })

        await waitFor(async () => {
            const notificationOnDatabase = await prisma.notification.findFirst({
                where: {
                    recipientId: user.id.toString()
                }
            })

            expect(notificationOnDatabase).not.toBeNull()
        })
    })
})