import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { PageView } from 'src/infrastructure/models/page-view.entity';

export class TutorialArticleMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class TutorialArticleAuthor {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
}

export class GetTutorialArticleResponse {
  id: number;
  position: number;
  title: string;
  slug: string;
  shortTitle: string;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  tags?: string[];
  text: string;
  chapter: TutorialChapter;
  chapterId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  author: TutorialArticleAuthor;
  medias: TutorialArticleMedia[];
  views: PageView[];
  updatedAt: Date;
}
