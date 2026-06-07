-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id" TEXT NOT NULL,
    "renda" DECIMAL(18,2) NOT NULL,
    "ciclo" TEXT NOT NULL DEFAULT 'mensal',
    "gastosFixos" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "meta" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envelopes" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "orcamento" DECIMAL(18,2) NOT NULL,
    "gasto" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "envelopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "envelopeId" TEXT NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_usuarioId_key" ON "perfis"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "envelopes_usuarioId_categoria_mes_ano_key" ON "envelopes"("usuarioId", "categoria", "mes", "ano");

-- AddForeignKey
ALTER TABLE "perfis" ADD CONSTRAINT "perfis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envelopes" ADD CONSTRAINT "envelopes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "envelopes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
