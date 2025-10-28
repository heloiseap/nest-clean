import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from 'src/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch recent questions e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()
    
    const accessToken = jwt.sign({sub: user.id.toString()})
    
    await Promise.all([
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 01'}),
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 02'})
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Question 01'}),
        expect.objectContaining({ title: 'Question 02'})
      ])
    })
  })

  test('[POST]/ questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id }, { algorithm: 'RS256'})
    console.log('Generated token:', accessToken)

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Question content',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    })
  })
})
//import { INestApplication } from '@nestjs/common'
// import { INestApplication } from '@nestjs/common'
// import { AppModule } from 'src/infra/app.module'
// import { Test } from '@nestjs/testing'
// import request from 'supertest'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import * as jwt from 'jsonwebtoken'

// describe('Fetch recent questions e2e', () => {
//   let app: INestApplication
//   let prisma: PrismaService

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile()

//     app = moduleRef.createNestApplication()
//     prisma = moduleRef.get(PrismaService)

//     await app.init()
//   })

//   function generateTestToken(sub: string): string {
//     const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('utf-8')
    
//     if (!privateKey) {
//       throw new Error('JWT_PRIVATE_KEY is not defined in environment')
//     }

//     return jwt.sign(
//       { sub }, 
//       privateKey, 
//       { 
//         algorithm: 'RS256',
//         expiresIn: '1h'
//       }
//     )
//   }

//   test('[GET]/ questions', async () => {
//     const user = await prisma.user.create({
//       data: {
//         name: 'John Doe',
//         email: 'johndoe@example.com',
//         password: '123456',
//       },
//     })

//     const accessToken = generateTestToken(user.id)

//     // Create some questions first
//     await prisma.question.createMany({
//       data: [
//         {
//           title: 'Question 1',
//           content: 'Content 1',
//           slug: 'question-1',
//           authorId: user.id,
//         },
//         {
//           title: 'Question 2', 
//           content: 'Content 2',
//           slug: 'question-2',
//           authorId: user.id,
//         },
//       ],
//     })

//     // Send GET request with page query parameter
//     const response = await request(app.getHttpServer())
//       .get('/questions')
//       .query({
//         page: 1, // This is what your controller expects
//       })
//       .set('Authorization', `Bearer ${accessToken}`)
//       .send()

//     console.log('Response status:', response.statusCode)
//     console.log('Response body:', JSON.stringify(response.body, null, 2))

//     expect(response.statusCode).toBe(200)
//     expect(response.body.questions).toHaveLength(2)
    
//     // The questions should be in reverse chronological order (most recent first)
//     expect(response.body.questions[0]).toMatchObject({
//       title: 'Question 2',
//     })
//     expect(response.body.questions[1]).toMatchObject({
//       title: 'Question 1', 
//     })
//   })
// })