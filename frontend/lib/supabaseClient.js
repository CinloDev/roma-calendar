import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const useMock = !(supabaseUrl && supabaseAnonKey)

export const supabase = useMock ? null : createClient(supabaseUrl, supabaseAnonKey)

function readMock() {
	try {
		const raw = globalThis.localStorage?.getItem('mock_bookings')
		return raw ? JSON.parse(raw) : []
	} catch (e) { return [] }
}

function writeMock(items) {
	try { globalThis.localStorage?.setItem('mock_bookings', JSON.stringify(items)) } catch(e){}
}

export async function fetchBookingsRange(startISO, endISO) {
	if (useMock) {
		const items = readMock()
		return { data: items.filter(b => b.date >= startISO && b.date < endISO), error: null }
	}
	return await supabase.from('bookings').select('*').gte('date', startISO).lt('date', endISO)
}

export async function insertBooking(payload) {
	if (useMock) {
		const items = readMock()
		const id = Date.now()
		const row = { id, ...payload }
		items.push(row)
		writeMock(items)
		return { data: [row], error: null }
	}
	return await supabase.from('bookings').insert([payload])
}

export const isMock = useMock
