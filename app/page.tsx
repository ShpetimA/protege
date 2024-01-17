import { Suspense } from "react";
import ObjectList from "./_components/ObjectList";
import DataPropertyList from "./_components/DataPropertyList";
import ClassesList from "./_components/ClassesList";

export interface Binding {
  [key : string]: {
    type: "uri";
    value: string;
  };
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


export default async function Home () {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl flex-col gap-12 flex w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold">Health Ontology</h1>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search The Ontology 
        </button>
        <div className="flex justify-center gap-8 flex-wrap">
          <Suspense fallback={<div>Loading...</div>}>
            <ObjectList />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <DataPropertyList />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <ClassesList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}



