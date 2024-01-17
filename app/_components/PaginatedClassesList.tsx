'use client'
import { useState } from "react"
import { Binding } from "../page"
import { healthUri } from "./ObjectList"

const offset = 10

const PaginatedClassesList = ({bindings}:{bindings: Binding[]}) => {
    'use client'
    const [page,setPage] = useState(1)

    const filterByUri = bindings.filter((item) => {
        return item.class.value.includes(healthUri)
    })
    const filterByPage = filterByUri.filter((item ,index)=> {
        return index <= page * offset && index >= (page - 1) * offset
    }) 

    return <>
              {filterByPage.map((item) => {
                    const property = item.class.value
                    if(!property) return <></>
        
                    return (
                        <li key={property} >
                        <p className="text-blue-500 hover:text-blue-800">{property.split(healthUri)[1]}</p>
                        </li>
                    )
                })
              }
              <div className="flex mt-4">
                <button onClick={() => setPage(page - 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l">
                  Prev
                </button>
                <button onClick={() => setPage(page + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
                  Next
                </button>
              </div>
    </>
}

export default PaginatedClassesList