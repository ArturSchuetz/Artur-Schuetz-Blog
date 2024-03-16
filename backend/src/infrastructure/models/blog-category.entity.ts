import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BlogArticle } from './blog-article.entity';
import { Media } from './media.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class BlogCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  color: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'titlePageImageId' })
  titlePageImage: Media;

  @Column({ nullable: true })
  titlePageImageId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BlogArticle, (article) => article.category)
  articles: BlogArticle[];

  @OneToMany(() => Media, (media) => media.blogCategory)
  medias: Media[];
}
