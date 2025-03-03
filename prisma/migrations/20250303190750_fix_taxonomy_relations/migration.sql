/*
  Warnings:

  - You are about to drop the column `class` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `family` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `genus` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `kingdom` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `phylum` on the `Taxonomy` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `Taxonomy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scientificName]` on the table `Species` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Taxonomy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Taxonomy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Taxonomy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES');

-- AlterTable
ALTER TABLE "Species" ALTER COLUMN "commonName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Taxonomy" DROP COLUMN "class",
DROP COLUMN "family",
DROP COLUMN "genus",
DROP COLUMN "kingdom",
DROP COLUMN "order",
DROP COLUMN "phylum",
DROP COLUMN "species",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "rank" "Rank" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Species_scientificName_key" ON "Species"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "Taxonomy_name_key" ON "Taxonomy"("name");

-- AddForeignKey
ALTER TABLE "Taxonomy" ADD CONSTRAINT "Taxonomy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Taxonomy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
