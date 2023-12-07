/*
  Warnings:

  - You are about to drop the column `month` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Group` table. All the data in the column will be lost.
  - Added the required column `date` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "month",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "month",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
