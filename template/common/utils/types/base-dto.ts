export interface BaseDto {
  id: string
  documentId: string
  deleted: boolean
  creationDate: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}
