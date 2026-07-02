-- CreateIndex
CREATE INDEX "ikli_scores_survey_id_idx" ON "ikli_scores"("survey_id");

-- CreateIndex
CREATE INDEX "ikli_scores_region_id_idx" ON "ikli_scores"("region_id");

-- CreateIndex
CREATE INDEX "ikli_scores_infrastructure_type_id_idx" ON "ikli_scores"("infrastructure_type_id");

-- CreateIndex
CREATE INDEX "ikli_scores_indicator_code_idx" ON "ikli_scores"("indicator_code");
