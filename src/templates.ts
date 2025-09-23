import { z } from "zod"
import { getHashSum } from "./utils"

/**
 * Standard template definitions for Aqua Protocol template objects
 * Each template contains a JSON schema that can be used to validate template_object structures
 */

// Basic document template schema
const basicDocumentSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string().optional(),
  created_at: z.string().optional(),
  tags: z.array(z.string()).optional()
})

// Configuration template schema
const configurationSchema = z.object({
  name: z.string(),
  version: z.string(),
  settings: z.record(z.unknown()),
  environment: z.enum(["development", "staging", "production"]).optional()
})

// User profile template schema
const userProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional()
  }),
  preferences: z.record(z.unknown()).optional(),
  created_at: z.string(),
  updated_at: z.string().optional()
})

// Data record template schema
const dataRecordSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.unknown()),
  metadata: z.object({
    source: z.string(),
    timestamp: z.string(),
    version: z.string().optional(),
    checksum: z.string().optional()
  }),
  relationships: z.array(z.object({
    type: z.string(),
    target: z.string(),
    properties: z.record(z.unknown()).optional()
  })).optional()
})

// API response template schema
const apiResponseSchema = z.object({
  status: z.enum(["success", "error", "pending"]),
  code: z.number(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  meta: z.object({
    timestamp: z.string(),
    request_id: z.string(),
    version: z.string().optional()
  }).optional(),
  errors: z.array(z.object({
    field: z.string().optional(),
    code: z.string(),
    message: z.string()
  })).optional()
})

/**
 * Template registry containing all standard templates
 * Key is the template name, value contains the Zod schema and metadata
 */
export const TEMPLATES = {
  basic_document: {
    name: "Basic Document",
    description: "A simple document with title, content, and optional metadata",
    schema: basicDocumentSchema,
    version: "1.0.0"
  },
  configuration: {
    name: "Configuration",
    description: "Configuration settings with name, version, and settings object",
    schema: configurationSchema,
    version: "1.0.0"
  },
  user_profile: {
    name: "User Profile",
    description: "User profile with personal information and preferences",
    schema: userProfileSchema,
    version: "1.0.0"
  },
  data_record: {
    name: "Data Record",
    description: "Structured data record with metadata and relationships",
    schema: dataRecordSchema,
    version: "1.0.0"
  },
  api_response: {
    name: "API Response",
    description: "Standardized API response with status, data, and error handling",
    schema: apiResponseSchema,
    version: "1.0.0"
  }
} as const

export type TemplateKey = keyof typeof TEMPLATES

/**
 * Template hash registry - contains the SHA256 hash of each template's JSON schema
 * These hashes can be used as template identifiers in template object revisions
 */
export const TEMPLATE_HASHES: Record<TemplateKey, string> = {} as any

// Generate hashes for all templates
Object.keys(TEMPLATES).forEach((key) => {
  const templateKey = key as TemplateKey
  const template = TEMPLATES[templateKey]

  // Create a serializable representation of the template
  const templateData = {
    name: template.name,
    description: template.description,
    version: template.version,
    schema: template.schema._def // Zod schema definition
  }

  // Generate hash from JSON stringified template
  const templateJson = JSON.stringify(templateData)
  TEMPLATE_HASHES[templateKey] = getHashSum(templateJson)
})

/**
 * Get template by hash
 * @param hash - SHA256 hash of the template
 * @returns Template object if found, undefined otherwise
 */
export function getTemplateByHash(hash: string): typeof TEMPLATES[TemplateKey] | undefined {
  const templateKey = Object.keys(TEMPLATE_HASHES).find(
    key => TEMPLATE_HASHES[key as TemplateKey] === hash
  ) as TemplateKey | undefined

  return templateKey ? TEMPLATES[templateKey] : undefined
}

/**
 * Validate template object against a template schema
 * @param templateObject - The object to validate
 * @param templateHash - Hash of the template to validate against
 * @returns Validation result with success status and potential error details
 */
export function validateTemplateObject(
  templateObject: Record<string, unknown>,
  templateHash: string
): { isValid: boolean; errors?: string[] } {
  const template = getTemplateByHash(templateHash)

  if (!template) {
    return {
      isValid: false,
      errors: [`Unknown template hash: ${templateHash}`]
    }
  }

  try {
    template.schema.parse(templateObject)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }

    return {
      isValid: false,
      errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    }
  }
}

/**
 * Get all available template hashes and their names
 * @returns Array of template info objects
 */
export function getAvailableTemplates(): Array<{
  hash: string;
  name: string;
  description: string;
  version: string;
}> {
  return Object.entries(TEMPLATE_HASHES).map(([key, hash]) => ({
    hash,
    name: TEMPLATES[key as TemplateKey].name,
    description: TEMPLATES[key as TemplateKey].description,
    version: TEMPLATES[key as TemplateKey].version
  }))
}