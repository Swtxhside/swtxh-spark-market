import { supabase } from './supabaseClient'

// ✅ Example function
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, stock, vendors(store_name)')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data
}

// ✅ Get product by ID
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, stock, vendors(store_name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}