import express from 'express'
import cloudinary from 'cloudinary'
import { readFileSync } from 'fs'
import multer from 'multer'
import * as dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
const testData = JSON.parse(readFileSync('./test-data.json'))
const swaggerDoc = JSON.parse(readFileSync('./v2Swagger.json'))

const router = express.Router()

dotenv.config()

const upload = multer({ dest: 'uploads/' })

router.use('/api-docs', swaggerUi.serve, swaggerUi.serve, (req, res) => { res.send(swaggerUi.generateHTML(swaggerDoc)) })

router.get('/ocr', (req, res) => {
  const data = testData
  const re = /[\d-]{12,20}/g
  const isbnList = data.info.ocr.adv_ocr.data[0].fullTextAnnotation.text.match(re).map(isbn => { return { isbn } })
  res.setHeader('Content-Type', 'application/json')
  res.json({ fullText: data.info.ocr.adv_ocr.data[0].fullTextAnnotation.text, isbnList })
})

router.post('/ocr', upload.single('document'), async (req, res) => {
  // upload image to cloudinary
  const filePath = `uploads/${req.file.filename}`

  // cloudinary config
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })

  const data = await cloudinary.v2.uploader
    .upload(filePath,
      { ocr: 'adv_ocr', folder: 'ocr' })
    .then(result => {
      return result
    }).catch(err => {
      console.log(err)
    })

  const cloudinaryFilePath = data.public_id

  // grep isbns from text
  const re = /[\d-]{12,20}/g
  const isbnList = data.info.ocr.adv_ocr.data[0].fullTextAnnotation.text.match(re)?.map(isbn => { return { isbn } }) || []

  const keepFiles = !!process.env.KEEP_FILES && ['true', 'TRUE', 'True', '1', 1, true].includes(process.env.KEEP_FILES)
  if (!keepFiles) {
    await cloudinary.uploader.destroy(cloudinaryFilePath, (result) => {
      // console.log(result)
    })
  }

  res.setHeader('Content-Type', 'application/json')
  res.json({ fullText: data.info.ocr.adv_ocr.data[0].fullTextAnnotation.text, isbnList })
})

export default router
