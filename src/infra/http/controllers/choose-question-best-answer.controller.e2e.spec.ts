
import { INestApplication } from '@nestjs/common'
import { AppModule } from 'src/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Choose question best answer e2e', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({sub: user.id.toString()})

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New Answer Content',
      })

    expect(response.statusCode).toBe(204)

    const questionOnDataBase = await prisma.question.findUnique({
      where: {
        id: question.id.toString()
    },
    })

    expect(questionOnDataBase?.bestAnswerId).toEqual(answerId)
  })
})