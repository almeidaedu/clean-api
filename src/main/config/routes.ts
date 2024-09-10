import { type Express, Router } from 'express'
import fg from 'fast-glob'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  const routeFiles = fg.sync('**/src/main/routes/**routes.ts')
  await Promise.all(routeFiles.map(async file => (await import(`../../../${file}`)).default(router)))
}
