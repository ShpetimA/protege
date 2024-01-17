export const fetchWrapper = async <T,>(url:string, options?:any): Promise<T | undefined> => {
  try{
    const res = await fetch(url, options)
    const json = await res.json()
    return json
  }catch(e) {
    return 
  }
}