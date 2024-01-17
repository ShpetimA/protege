import { SparqlResults } from "../page"
import { fetchWrapper } from "../util/Util"
export const healthUri = 'http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/'

const ObjectList = async () => {
    const getObjectProperties = `query=
      PREFIX health: <http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      SELECT ?property
      WHERE {
        ?property a owl:ObjectProperty .
      }
    `
    const res = await fetchWrapper<SparqlResults>('http://localhost:3030/HealthReasoner/query',{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: getObjectProperties 
    })
  
  
    if(typeof res === 'undefined') {
      return <>
      </>
    }
  
  
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Object Properties</h1>
        <ul className="flex flex-col justify-between">
          {
            res.results.bindings.map((item) => {
              const property = item.property.value
              if(!item.property?.value) return <></>
  
              return (
                <li key={property} className="mx-2">
                  <p className="text-blue-500 hover:text-blue-800">{property.split(healthUri)[1]}</p>
                </li>
              )
            })
          }
        </ul>
    </div>
    )
  }
  
export default ObjectList