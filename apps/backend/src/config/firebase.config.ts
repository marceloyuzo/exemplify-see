import { Injectable, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'

interface VerifyTokenProps {
  token: string
}

@Injectable()
export class FirebaseConfig {
  private readonly logger = new Logger(FirebaseConfig.name)
  private app: admin.app.App

  constructor() {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Variáveis de ambiente do Firebase estão incompletas')
      }

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    } else {
      this.app = admin.app()
    }
  }

  async verifyToken({
    token,
  }: VerifyTokenProps): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token)

      return decodedToken
    } catch (error) {
      this.logger.error('Erro na verificação do token Firebase:', error.message)
      throw error
    }
  }
}
