import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  createSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  isValidSlug(slug: string): boolean {
    const validSlugPattern = /^[a-z0-9-]+$/;
    return validSlugPattern.test(slug);
  }
}
