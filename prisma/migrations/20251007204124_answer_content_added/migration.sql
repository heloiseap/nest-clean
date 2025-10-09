/*
  Warnings:

  - Added the required column `content` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."answers" ADD COLUMN     "content" TEXT NOT NULL;
