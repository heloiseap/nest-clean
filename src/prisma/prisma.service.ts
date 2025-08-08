import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    public client: PrismaClient 

    constructor() {
        super()
    }
    onModuleInit() {
        return this.$connect
    }
    onModuleDestroy() {
        return this.$disconnect
    }

}