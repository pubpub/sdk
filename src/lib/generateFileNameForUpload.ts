import { generateHash } from './generateHash.js'

export const generateFileNameForUpload = (file: string) => {
  const folderName = generateHash(8)
  const extension = file !== undefined ? file.split('.').pop() : 'jpg'
  const random = Math.floor(Math.random() * 8)
  const now = new Date().getTime()
  return `${folderName}/${random}${now}.${extension}`
}
