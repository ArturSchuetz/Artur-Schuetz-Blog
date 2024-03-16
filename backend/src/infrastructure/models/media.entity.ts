import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BlogCategory } from './blog-category.entity';
import { BlogArticle } from './blog-article.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { TutorialCategory } from './tutorial-category.entity';
import { TutorialTopic } from './tutorial-topic.entity';
import { TutorialChapter } from './tutorial-chapter.entity';
import { TutorialArticle } from './tutorial-article.entity';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512 })
  filepath: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @ManyToOne(() => Project, (project) => project.medias)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(() => BlogArticle, (article) => article.medias)
  @JoinColumn({ name: 'blogArticleId' })
  blogArticle: BlogArticle;

  @Column({ nullable: true })
  blogArticleId: number;

  @ManyToOne(() => BlogCategory, (category) => category.medias)
  @JoinColumn({ name: 'blogCategoryId' })
  blogCategory: BlogCategory;

  @Column({ nullable: true })
  blogCategoryId: number;

  @ManyToOne(() => TutorialCategory, (tutorialCategory) => tutorialCategory.medias)
  @JoinColumn({ name: 'tutorialCategoryId' })
  tutorialCategory: TutorialCategory;

  @Column({ nullable: true })
  tutorialCategoryId: number;

  @ManyToOne(() => TutorialTopic, (tutorialTopic) => tutorialTopic.medias)
  @JoinColumn({ name: 'tutorialTopicId' })
  tutorialTopic: TutorialTopic;

  @Column({ nullable: true })
  tutorialTopicId: number;

  @ManyToOne(() => TutorialChapter, (tutorialChapter) => tutorialChapter.medias)
  @JoinColumn({ name: 'tutorialChapterId' })
  tutorialChapter: TutorialChapter;

  @Column({ nullable: true })
  tutorialChapterId: number;

  @ManyToOne(() => TutorialArticle, (tutorialArticle) => tutorialArticle.medias)
  @JoinColumn({ name: 'tutorialArticleId' })
  tutorialArticle: TutorialArticle;

  @Column({ nullable: true })
  tutorialArticleId: number;

  @ManyToOne(() => User, (user) => user.medias)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
