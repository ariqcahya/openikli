-- CreateTable
CREATE TABLE "survey_indicators" (
    "id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "survey_indicators_survey_id_code_key" ON "survey_indicators"("survey_id", "code");

-- AddForeignKey
ALTER TABLE "survey_indicators" ADD CONSTRAINT "survey_indicators_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
