import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SERVICE KEY LOADED:', !!process.env.SUPABASE_SERVICE_KEY)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// 1) Setup Supabase client (backend uses service_role key)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 2) GET route to see all submissions (from Supabase)
app.get('/api/forms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('received_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('Error fetching forms:', err.message)
    res.status(500).json({ message: 'Error fetching forms' })
  }
})

// 3) POST route to save a form into Supabase
app.post('/api/form', async (req, res) => {
  try {
    const data = req.body
    console.log('Received form data:', data)

    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      city: data.city || null,
      country: data.country || null,
      email: data.email,
      // received_at: will default to now() in the table
    }

    const { data: inserted, error } = await supabase
      .from('form_submissions')
      .insert([payload])
      .select()

    if (error) throw error

    res.json({
      status: 'ok',
      message: 'Form saved in Supabase',
      record: inserted[0],
    })
  } catch (err) {
    console.error('Error saving form:', err.message)
    res.status(500).json({
      status: 'error',
      message: 'Error saving form in Supabase',
    })
  }
})

// Optional: homepage
app.get('/', (req, res) => {
  res.send('Backend is running. Use POST /api/form and GET /api/forms')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
