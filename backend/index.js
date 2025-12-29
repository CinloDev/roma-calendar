require('dotenv').config()
const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app.post('/api/bookings', async (req,res)=>{
  const payload = req.body
  try{
    const { data, error } = await supabase.from('bookings').insert([payload])
    if (error) return res.status(400).json({ error: error.message })
    res.json({ data })
  }catch(err){
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3001
app.listen(port, ()=>console.log('Backend listening on', port))
