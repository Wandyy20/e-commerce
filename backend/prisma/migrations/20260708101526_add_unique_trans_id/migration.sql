/*
  Warnings:

  - A unique constraint covering the columns `[trans_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_trans_id_key" ON "Payment"("trans_id");
