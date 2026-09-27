import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProduct1730000000000 implements MigrationInterface {
    name = 'CreateProduct1730000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" SERIAL NOT NULL,
                "article" character varying NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "quantity" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_product_id" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "product" ADD CONSTRAINT "UQ_product_article" UNIQUE ("article")
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" DROP CONSTRAINT "UQ_product_article"`
        )
        await queryRunner.query(`DROP TABLE "product"`)
    }
}
