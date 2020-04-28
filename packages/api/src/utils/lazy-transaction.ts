/* eslint no-param-reassign: off */

import {
  getConnection,
  getMetadataArgsStorage,
  MongoRepository,
  Repository,
  TreeRepository,
  EntityManager,
} from 'typeorm';

import { TransactionOptions } from 'typeorm/decorator/options/TransactionOptions';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

/**
 * Wraps some method into the transaction.
 *
 * Method result will return a promise if this decorator applied.
 * All database operations in the wrapped method should be executed using entity managed passed
 * as a first parameter into the wrapped method.
 *
 * If you want to control at what position in your method parameters entity manager should be injected,
 * then use @TransactionEntityManager() decorator.
 *
 * If you want to use repositories instead of bare entity manager,
 * then use @TransactionRepository() decorator.
 */
export function LazyTransaction(connectionName?: string): MethodDecorator;
export function LazyTransaction(
  connectionOrOptions?: string | TransactionOptions
): MethodDecorator {
  return function (
    target: Record<string, any>,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // save original method - we gonna need it
    const originalMethod = descriptor.value;

    // override method descriptor with proxy method
    descriptor.value = function (...args: any[]) {
      const transactionCallback = (entityManager: EntityManager) => {
        let argsWithInjectedTransactionManagerAndRepositories: any[];

        // filter all @TransactionEntityManager() and @TransactionRepository() decorator usages for this method
        const transactionEntityManagerMetadatas = getMetadataArgsStorage()
          .filterTransactionEntityManagers(
            target.constructor,
            typeof methodName === 'string' ? methodName : methodName.toString()
          )
          .reverse();

        const transactionRepositoryMetadatas = getMetadataArgsStorage()
          .filterTransactionRepository(
            target.constructor,
            typeof methodName === 'string' ? methodName : methodName.toString()
          )
          .reverse();

        // if there are @TransactionEntityManager() decorator usages the inject them
        if (transactionEntityManagerMetadatas.length > 0) {
          argsWithInjectedTransactionManagerAndRepositories = [...args];
          // replace method params with injection of transactionEntityManager
          transactionEntityManagerMetadatas.forEach((metadata) => {
            // only inject if not already there
            if (
              argsWithInjectedTransactionManagerAndRepositories[
                metadata.index
              ] !== entityManager
            ) {
              argsWithInjectedTransactionManagerAndRepositories.splice(
                metadata.index,
                0,
                entityManager
              );
            }
          });
        } else if (transactionRepositoryMetadatas.length === 0) {
          // otherwise if there's no transaction repositories in use, inject it as a first parameter
          argsWithInjectedTransactionManagerAndRepositories = [
            entityManager,
            ...args,
          ];
        } else {
          argsWithInjectedTransactionManagerAndRepositories = [...args];
        }

        // for every usage of @TransactionRepository decorator
        transactionRepositoryMetadatas.forEach((metadata) => {
          let repositoryInstance: any;

          // detect type of the repository and get instance from transaction entity manager
          switch (metadata.repositoryType) {
            case Repository:
              repositoryInstance = entityManager.getRepository(
                metadata.entityType!
              );
              break;
            case MongoRepository:
              repositoryInstance = entityManager.getMongoRepository(
                metadata.entityType!
              );
              break;
            case TreeRepository:
              repositoryInstance = entityManager.getTreeRepository(
                metadata.entityType!
              );
              break;
            // if not the TypeORM's ones, there must be custom repository classes
            default:
              repositoryInstance = entityManager.getCustomRepository(
                metadata.repositoryType
              );
          }

          // Only inject if not already there
          if (
            argsWithInjectedTransactionManagerAndRepositories[
              metadata.index
            ] !== repositoryInstance
          ) {
            // replace method param with injection of repository instance
            argsWithInjectedTransactionManagerAndRepositories.splice(
              metadata.index,
              0,
              repositoryInstance
            );
          }
        });

        return originalMethod.apply(
          this,
          argsWithInjectedTransactionManagerAndRepositories
        );
      };

      const existingEntityManagerOrRepository:
        | EntityManager
        | Repository<any> = args.find(
        (arg) => arg instanceof EntityManager || arg instanceof Repository
      );

      if (existingEntityManagerOrRepository) {
        return transactionCallback(
          existingEntityManagerOrRepository instanceof EntityManager
            ? existingEntityManagerOrRepository
            : existingEntityManagerOrRepository.manager
        );
      } else {
        let connectionName = 'default';
        let isolationLevel: IsolationLevel | undefined = undefined;
        if (connectionOrOptions) {
          if (typeof connectionOrOptions === 'string') {
            connectionName = connectionOrOptions;
          } else {
            if (connectionOrOptions.connectionName) {
              connectionName = connectionOrOptions.connectionName;
            }
            if (connectionOrOptions.isolation) {
              isolationLevel = connectionOrOptions.isolation;
            }
          }
        }
        if (isolationLevel) {
          return getConnection(connectionName).manager.transaction(
            isolationLevel,
            transactionCallback
          );
        } else {
          return getConnection(connectionName).manager.transaction(
            transactionCallback
          );
        }
      }
    };
  };
}
