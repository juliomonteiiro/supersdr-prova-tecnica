-- CreateTable
CREATE TABLE "MessageIntent" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "reason" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageIntent_messageId_key" ON "MessageIntent"("messageId");

-- AddForeignKey
ALTER TABLE "MessageIntent"
ADD CONSTRAINT "MessageIntent_messageId_fkey"
FOREIGN KEY ("messageId") REFERENCES "Message"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
