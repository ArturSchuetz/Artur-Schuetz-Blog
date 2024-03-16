export class BlogCategoryMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class UpdateBlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
  color: string;
  titlePageImageId: number;
  medias: BlogCategoryMedia[];
}
