import { Injectable, Logger } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer: Buffer
}

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name)
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly publicUrl: string

  constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.R2_ENDPOINT,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })

    this.bucketName = process.env.R2_BUCKET_NAME!
    this.publicUrl = process.env.R2_PUBLIC_URL!
  }

  async uploadFile(
    file: MulterFile,
    customPath?: string,
  ): Promise<{ key: string; url: string }> {
    try {
      const fileExtension = path.extname(file.originalname)
      const fileName = `${uuidv4()}${fileExtension}`
      const key = customPath ? `${customPath}/${fileName}` : fileName

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      })

      await this.s3Client.send(command)

      const url = `${this.publicUrl}/${key}`

      this.logger.log(`File uploaded successfully: ${key}`)
      return { key, url }
    } catch (error) {
      this.logger.error('Error uploading file to R2:', error)
      throw new Error('Failed to upload file')
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      await this.s3Client.send(command)
      this.logger.log(`File deleted successfully: ${key}`)
    } catch (error) {
      this.logger.error('Error deleting file from R2:', error)
      throw new Error('Failed to delete file')
    }
  }
}
