/* GENERATED from contracts/schemas/manifest.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Inventory of every shipped data file (web/public/data/manifest.json). Sources are cited per file, so there is no top-level source_urls.
 */
export interface Manifest {
  /**
   * Contract version of this file (unitless integer). Bumped on any breaking change to the file's schema.
   */
  schema_version: 1;
  /**
   * Instant this file was generated, UTC ISO 8601 with Z.
   */
  generated_at: string;
  /**
   * One entry per shipped file, excluding manifest.json itself.
   */
  files: ManifestFile[];
}
/**
 * One shipped data file.
 */
export interface ManifestFile {
  /**
   * Path relative to web/public/data/ with forward slashes (no units), e.g. masks/shackleton-rim.json.
   */
  path: string;
  /**
   * File size in bytes.
   */
  bytes: number;
  /**
   * SHA-256 of the file contents as 64 lower-case hex characters (no units).
   */
  sha256: string;
  source_urls: SourceUrls;
}
