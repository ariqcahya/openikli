-- CreateTable
CREATE TABLE "master_dimensi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_dimensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_unsur" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dimensi_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_unsur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_aspek" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unsur_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_aspek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_dimensi_organization_id_name_key" ON "master_dimensi"("organization_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "master_unsur_organization_id_dimensi_id_name_key" ON "master_unsur"("organization_id", "dimensi_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "master_aspek_organization_id_unsur_id_name_key" ON "master_aspek"("organization_id", "unsur_id", "name");

-- AddForeignKey
ALTER TABLE "master_dimensi" ADD CONSTRAINT "master_dimensi_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_unsur" ADD CONSTRAINT "master_unsur_dimensi_id_fkey" FOREIGN KEY ("dimensi_id") REFERENCES "master_dimensi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_unsur" ADD CONSTRAINT "master_unsur_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_aspek" ADD CONSTRAINT "master_aspek_unsur_id_fkey" FOREIGN KEY ("unsur_id") REFERENCES "master_unsur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_aspek" ADD CONSTRAINT "master_aspek_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
