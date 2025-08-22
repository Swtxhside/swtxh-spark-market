import { supabase } from '../integrations/supabase/client'

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

// ... paste the rest of the functions here ...