// import { INestApplication } from '@nestjs/common'
// import { AppModule } from 'src/infra/app.module'
// import { Test } from '@nestjs/testing'
// import request from 'supertest'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { JwtService } from '@nestjs/jwt'

// describe('Create question e2e', () => {
//   let app: INestApplication
//   let prisma: PrismaService
//   let jwt: JwtService

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile()

//     app = moduleRef.createNestApplication()

//     prisma = moduleRef.get(PrismaService)
//     jwt = moduleRef.get(JwtService)

//     await app.init()
//   })

//   test('[POST]/ questions', async () => {
//     const user = await prisma.user.create({
//       data: {
//         name: 'John Doe',
//         email: 'johndoe@example.com',
//         password: '123456',
//       },
//     })

//     const accessToken = jwt.sign({ sub: user.id })

//     const response = await request(app.getHttpServer())
//       .post('/questions')
//       .set('Authorization', `Bearer ${accessToken}`)
//       .send({
//         title: 'New Question',
//         content: 'Question Content',
//       })

//     expect(response.statusCode).toBe(201)

//     const questionOnDataBase = await prisma.question.findFirst({
//       where: {
//         title: 'New Question',
//       },
//     })

//     expect(questionOnDataBase).toBeTruthy()
//   })
// })
// create-question.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { AppModule } from 'src/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'

describe('Create question e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  // function generateTestToken(sub: string): string {
  //   const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('utf-8')
    
  //   if (!privateKey) {
  //     throw new Error('JWT_PRIVATE_KEY is not defined in environment')
  //   }

  //   return jwt.sign(
  //     { sub }, 
  //     privateKey, 
  //     { 
  //       algorithm: 'RS256',
  //       expiresIn: '1h'
  //     }
  //   )
  // }

  test('[POST]/ questions', async () => {
    const user = await studentFactory.makePrismaStudent()
    // const user = await prisma.user.create({
    //   data: {
    //     name: 'John Doe',
    //     email: 'johndoe@example.com',
    //     password: '123456',
    //   },
    // })

    // const accessToken = generateTestToken(user.id)
    const accessToken = jwt.sign({sub: user.id.toString()})

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question Content',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: 'New Question',
      },
    })

    expect(questionOnDataBase).toBeTruthy()
  })
})