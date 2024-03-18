import { EntityManager, QueryRunner } from "typeorm";
import { handleError } from "./error.service";

type TransactionFunction = (entityManager: EntityManager) => Promise<any>;

export const transactionWrapper = async (
  entityManager: EntityManager,
  transactionCallback: TransactionFunction
): Promise<any> => {
  const queryRunner: QueryRunner = entityManager.connection.createQueryRunner();

  const activeQueryRunner = await queryRunner.connect();

  const transactionManager = queryRunner.manager;

  let result;

  try {
    await queryRunner.startTransaction();
    result = await transactionCallback(transactionManager);
    await queryRunner.commitTransaction();
  } catch (error) {
    handleError(
      new Error(String(error)),
      "Error encountered during transaction. Rolling Back"
    );
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }

  if (result) return result;
};
