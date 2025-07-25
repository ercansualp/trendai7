/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { ContentStatusEnum } from './contentStatusEnum';
import type { ContentTypeEnum } from './contentTypeEnum';
import type { ProjectEnum } from './projectEnum';
import type { ArticleDto } from './articleDto';

export interface UpdateContentRequest {
  contentStatus?: ContentStatusEnum;
  contentType?: ContentTypeEnum;
  platformType?: ProjectEnum;
  /** @nullable */
  tagIds?: number[] | null;
  /** @nullable */
  articles?: ArticleDto[] | null;
  /** @nullable */
  authorId?: string | null;
  /** @nullable */
  sourceId?: number | null;
  readingDuration?: number;
  /** @nullable */
  featured?: boolean | null;
  /** @nullable */
  id?: string | null;
}
