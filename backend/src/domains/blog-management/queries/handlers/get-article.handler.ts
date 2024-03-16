import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetBlogArticleQuery } from '../get-article.query';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import {
  BlogArticleAuthorResponse,
  GetBlogArticleResponse,
} from '../../data-transfer-objects/get-article-response.dto';
import { PageView } from 'src/infrastructure/models/page-view.entity';

@QueryHandler(GetBlogArticleQuery)
export class GetBlogArticleHandler implements IQueryHandler<GetBlogArticleQuery> {
  private readonly logger = new Logger(GetBlogArticleHandler.name);

  constructor(
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  async execute(query: GetBlogArticleQuery): Promise<GetBlogArticleResponse> {
    /* this.logger.log(`Handling GetBlogArticleQuery: ${JSON.stringify(query)}`); */

    const { articleId, isUserAuthenticated } = query;

    try {
      let whereCondition;
      if (typeof articleId === 'number') {
        // Wenn categoryId ein number ist, suche nach ID
        whereCondition = { id: articleId };
      } else if (typeof articleId === 'string') {
        // Prüfe, ob die articleId vollständig numerisch ist
        if (/^\d+$/.test(articleId)) {
          // Wenn articleId eine Zeichenkette ist, die nur Zahlen enthält, behandele sie als numerische ID
          whereCondition = { id: parseInt(articleId, 10) };
        } else {
          // Ansonsten gehe davon aus, dass es sich um einen Slug handelt
          whereCondition = { slug: articleId };
        }
      }

      const article = await this.articleRepository.findOne({
          where: whereCondition,
          relations: [
              'medias',
              'category',
              'previousArticle',
              'nextArticle',
              'author',
          ],
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      const getArticleResponse = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        text: article.text,
        titlePageImageId: article.titlePageImageId,
        previewHostedVideoUrl: article.previewHostedVideoUrl,
        previewMediaId: article.previewMediaId,
        previewText: article.previewText,
        advertisement: article.advertisement,
        tags: article.tags,
        category: article.category,
        categoryId: article.categoryId,
        previousArticle: article.previousArticle,
        previousArticleId: article.previousArticleId,
        nextArticle: article.nextArticle,
        nextArticleId: article.nextArticleId,
        useMathJax: article.useMathJax,
        isPublished: article.isPublished,
        releasedAt: article.releasedAt,
        updatedAt: article.updatedAt,
        views: article.views,
        author: {
          id: article.author.id,
          firstName: article.author.firstName,
          lastName: article.author.lastName,
          avatarImageId: article.author.avatarImageId,
        },
        medias: article.medias,
      } as GetBlogArticleResponse;

      /* this.logger.log(
        `Successfully executed GetBlogArticleQuery: ${JSON.stringify(
          getArticleResponse,
        )}`,
      ); */

      return getArticleResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
