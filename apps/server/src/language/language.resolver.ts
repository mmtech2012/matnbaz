import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { CacheControl } from '@exonest/graphql-cache-control';
import { PaginationArgs } from '@exonest/graphql-connections';
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as P from '@prisma/client';
import * as GithubColors from 'github-colors';
import { PrismaService } from 'nestjs-prisma';
import { createColorObject } from '../color/utils';
import { Color } from '../models/color.model';
import { LanguageConnection } from '../models/connections/language.connection';
import { RepositoryConnection } from '../models/connections/repository.connection';
import { Language } from '../models/language.model';
import { paginationComplexity } from '../plugins/pagination-complexity';
import { LanguageIdArgs } from './args/language-id.args';
import { LanguageOrderArgs } from './args/language-order.args';
import { LanguageSlugArgs } from './args/language-slug.args';
import { LanguageOrder } from './enums/language-order.enum';

@Resolver(() => Language)
export class LanguageResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => LanguageConnection, {
    // complexity: paginationComplexity,
  })
  @CacheControl({ maxAge: 180 })
  async languages(
    @Args() pagination: PaginationArgs,
    @Args() { order }: LanguageOrderArgs
  ) {
    order = order || LanguageOrder.REPOSITORIES_DESC;

    return findManyCursorConnection(
      (args) =>
        this.prisma.language.findMany({
          orderBy: {
            [LanguageOrder.REPOSITORIES_DESC]: {
              Repositories: { _count: 'desc' as const },
            },
          }[order],
          ...args,
        }),
      () => this.prisma.language.count(),
      pagination
    );
  }

  @Query(() => Language, { nullable: true })
  async language(@Args() { slug }: LanguageSlugArgs) {
    return this.prisma.language.findUnique({ where: { slug } });
  }

  async languageById(@Args() { id }: LanguageIdArgs) {
    return this.prisma.language.findUnique({ where: { id } });
  }

  @ResolveField(() => Color, { nullable: true })
  color(@Parent() { name }: P.Language) {
    const color = GithubColors.get(name)?.color;
    return color ? createColorObject(GithubColors.get(name)?.color) : null;
  }

  @ResolveField(() => RepositoryConnection, {
    complexity: paginationComplexity,
  })
  async repositories(
    @Parent() { id }: P.Language,
    @Args() pagination: PaginationArgs
  ) {
    const languagePromise = this.prisma.language.findUnique({ where: { id } });

    return findManyCursorConnection(
      (args) => languagePromise.Repositories(args),
      async () =>
        (await languagePromise.Repositories({ select: { id: true } })).length,
      pagination
    );
  }

  @ResolveField(() => Int)
  async repositoriesCount(@Parent() { id }: P.Language) {
    return (
      await this.prisma.language
        .findUnique({ where: { id } })
        .Repositories({ select: { id: true } })
    ).length;
  }
}
