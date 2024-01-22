import { Fragment, Suspense } from "react";
import PatientDiseases from "./components/PatientDiseases";
import { fetchWrapper } from "../util/Util";
import { healthUri } from "../_components/ObjectList";

export interface Binding {
  [key: string]: any,
}

export interface Result {
  bindings: Binding[];
}

export interface Head {
  vars: string[];
}

export interface SparqlResults {
  head: Head;
  results: Result;
}


export default async function Patient () {
    const getObjectProperties = `query=
        PREFIX health: <http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/>
        SELECT ?person 
        WHERE {
            ?person a health:Person.
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
        return <Fragment/>
    }

    const firstNames = res.results.bindings.map((item) => {
        return {
            value: item.person.value.split(healthUri)[1]
        }
    })
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl flex-col gap-12 flex w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold">Select Patient</h1>
        </div>
        <div className="flex justify-center gap-8 flex-wrap">
            <PatientDiseases options={firstNames}/>
        </div>
      </div>
    </main>
  )
}



