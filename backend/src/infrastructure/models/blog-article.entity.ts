import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BlogCategory } from './blog-category.entity';
import { Media } from './media.entity';
import { User } from './user.entity';
import { PageView } from './page-view.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class BlogArticle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'titlePageImageId' })
  titlePageImage: Media;

  @Column({ nullable: true })
  titlePageImageId: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  previewHostedVideoUrl: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'previewMediaId' })
  previewMedia: Media;

  @Column({ nullable: true })
  previewMediaId: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  previewText?: string;

  @Column({ type: 'varchar', nullable: true })
  advertisement?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  tags?: string[];

  @ManyToOne(() => BlogCategory)
  @JoinColumn({ name: 'categoryId' })
  category: BlogCategory;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => BlogArticle)
  @JoinColumn({ name: 'previousArticleId' })
  previousArticle: BlogArticle;

  @Column({ nullable: true })
  previousArticleId: number;

  @ManyToOne(() => BlogArticle)
  @JoinColumn({ name: 'nextArticleId' })
  nextArticle: BlogArticle;

  @Column({ nullable: true })
  nextArticleId: number;

  @Column({ type: 'boolean', default: false })
  useMathJax: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  authorId: number;

  @OneToMany(() => Media, (media) => media.blogArticle)
  medias: Media[];
  
  @OneToMany(() => PageView, (pageView) => pageView.article)
  views: PageView[];
}
