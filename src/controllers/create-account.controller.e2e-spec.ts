import { INestApplication } from "@nestjs/common"
import { AppModule } from "src/app.module"
import { Test } from "@nestjs/testing"
import { email } from "zod"
import request from 'supertest'

describe('Create account e2e', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()

        await app.init()
    })
    
    test('[POST]/ accounts', async () => {
        const response = await request(app.getHttpServer()).post('/accounts').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(response.statusCode).toBe(201)
    })
})