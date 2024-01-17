import { SparqlResults } from "../page"
import { fetchWrapper } from "../util/Util"
import PaginatedClassesList from "./PaginatedClassesList"
export const healthUri = 'http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/'

const ClassesList = async () => {
    const getClassesList = `query=
      PREFIX health: <http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      SELECT ?class
      WHERE {
        ?class a owl:Class .
      }
    `
    const res = await fetchWrapper<SparqlResults>('http://localhost:3030/HealthReasoner/query',{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: getClassesList 
    })
  
  
    if(typeof res === 'undefined') {
      return <>
      </>
    }
  
  
    return (
      <div className="flex flex-col gap-2 min-w-52">
        <h1 className="text-2xl font-bold">Classes</h1>
        <ul className="flex flex-col justify-between">
        <PaginatedClassesList bindings={res.results.bindings} />
        </ul>
      </div>
    )
  }
  
export default ClassesList 