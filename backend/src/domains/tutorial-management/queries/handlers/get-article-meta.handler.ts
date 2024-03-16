import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTutorialArticleMetaQuery } from '../get-article-meta.query';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import {
  TutorialArticleAuthor,
  GetTutorialArticleResponse,
} from '../../data-transfer-objects/get-article-response.dto';
import { PageView } from 'src/infrastructure/models/page-view.entity';

@QueryHandler(GetTutorialArticleMetaQuery)
export class GetTutorialArticleMetaHandler implements IQueryHandler<GetTutorialArticleMetaQuery> {
  private readonly logger = new Logger(GetTutorialArticleMetaHandler.name);

  constructor(
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  async execute(query: GetTutorialArticleMetaQuery): Promise<GetTutorialArticleResponse> {
    /* this.logger.log(`Handling GetTutorialArticleQuery: ${JSON.stringify(query)}`); */

    const { articleId, isUserAuthenticated } = query;

    try {
      let whereCondition;
      if (typeof articleId === 'number') {
        // Wenn articleId ein number ist, suche nach ID
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
              'chapter',
              'author',
          ],
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      const getArticleResponse = {
        id: article.id,
        position: article.position,
        title: article.title,
        slug: article.slug,
        shortTitle: article.shortTitle,
        text: "",
        previewHostedVideoUrl: article.previewHostedVideoUrl,
        previewMediaId: article.previewMediaId,
        previewText: article.previewText,
        tags: article.tags,
        chapter: article.chapter,
        chapterId: article.chapterId,
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
      } as GetTutorialArticleResponse;

      /* this.logger.log(
        `Successfully executed GetTutorialArticleQuery: ${JSON.stringify(
          getArticleResponse,
        )}`,
      ); */

      if(article.isPublished && !isUserAuthenticated) {
        await this.pageViewRepository.save({
          tutorialId: article.id,
          ipHash: "undefined",
        });
      }
      
      return getArticleResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
