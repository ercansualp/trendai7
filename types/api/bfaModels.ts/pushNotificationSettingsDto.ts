/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { PlatformTypeEnum } from './platformTypeEnum';

export interface PushNotificationSettingsDto {
  id?: string;
  createdAt?: string;
  /** @nullable */
  fcmServerKey?: string | null;
  platformType?: PlatformTypeEnum;
}
