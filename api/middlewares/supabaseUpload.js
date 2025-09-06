import { supabase } from '../lib/supabaseClient.js'
import path from 'path'

export const uploadToSupabase = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next()
  }
  console.log("og file name:", req.files)

  try {
    const uploadPromises = req.files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      })

      if (error) {
        console.log('error: in sbUMiddleware: ', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      return publicUrl
    })
    const imagePaths = await Promise.all(uploadPromises)
    req.imagePaths = imagePaths
    next()
  } catch (err) {
    console.error('Error uploading files to Supabase:', err);
    return res.status(500).json({ error: 'Failed to upload files' });
  }
}