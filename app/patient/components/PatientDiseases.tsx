'use client'
import { fetchWrapper } from '@/app/util/Util'
import React, { useEffect } from 'react'
import { SparqlResults } from '../page'
import { healthUri } from '@/app/_components/ObjectList'

type TProps = {
    options: {
        value: string
    }[]
}

const PatientDiseases = ({options}: TProps) => {
  const [groupdedDiseases, setGroupdedDiseases] = React.useState<any>()

  useEffect(() => {
    onSearch(options[0].value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const groupByDisease = (data: any) => {
    const groupedData:any = {};
  
    data.forEach((entry:any)=> {
      let diseaseUri = entry.disease.value;
      let symptomUri = entry.symptom.value;
    
      if(typeof symptomUri !== 'string') {
        symptomUri = symptomUri.value;
      }

      if(typeof diseaseUri !== 'string') {
        diseaseUri = diseaseUri.value;
      }

      if(groupedData[diseaseUri]) {
        groupedData[diseaseUri].hasStar = entry.disease.hasStar
      }
      if (!groupedData[diseaseUri]) {
        groupedData[diseaseUri] = {
          hasStar: entry.disease.hasStar,
          symptoms: []
        };
      }
  
      groupedData[diseaseUri].symptoms.push({
        hasStar: entry.symptom.hasStar,
        symptomUri
      });
    });
  
    return groupedData;
  }
  
  const onSearch = async (person: string) => {
    const getDiseasesFromSymptoms = `query=
            PREFIX health: <http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?disease ?symptom
            WHERE {
                health:${person} health:hasSymptom ?symptom.
                ?symptom rdf:type ?symptomType.
                ?disease rdf:type health:Disease .
                ?disease health:hasSymptom ?symptomType .
            }
    `
    const getSymptomsFromDisease = `query=
            PREFIX health: <http://www.semanticweb.org/shpetimalimi/ontologies/2024/0/health.owl#/>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?disease ?symptom
            WHERE {
                health:${person} health:hasDisease ?disease.
                ?disease health:hasSymptom ?symptom.
            }
    `
    const res = await fetchWrapper<SparqlResults>('http://localhost:3030/HealthReasoner/query',{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: getDiseasesFromSymptoms
    })

    const resSymp = await fetchWrapper<SparqlResults>('http://localhost:3030/HealthReasoner/query',{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: getSymptomsFromDisease
    })

    const diseaseStar = res?.results.bindings.map((dis) => {
        return {
            ...dis,
            symptom: {
                value: dis.symptom.value,
                hasStar: true 
            }
        }

    }) ?? []

    const sympStar = resSymp?.results.bindings.map((item) => {
        return {
            ...item,
            disease: {
                value: item.disease.value,
                hasStar: true 
            }
        }
    }) ?? []
    const concated = [...diseaseStar, ...sympStar]

    setGroupdedDiseases(groupByDisease(concated))
  }

  return (
    <>
        <select onChange={(e) => {
            onSearch(e.target.value)
        }} className="w-full h-10 pl-3 pr-6 text-black placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" name="disease">
            {
                options.map((item, index) => {
                return (
                    <option key={index} value={item.value}>{`${item.value}`}</option>
                )
                })
            }
        </select>
        <div className="flex flex-col w-full">
            {
                groupdedDiseases && Object.keys(groupdedDiseases).map((disease,index) => {
                    return (
                        <div className='flex flex-col border border-solid rounded-sm p-8 gap-2' key={index}>
                            <h1 className="text-2xl font-bold">{groupdedDiseases[disease].hasStar && '*'}{disease.split(healthUri)[1]}</h1>
                            <ul className="flex flex-col justify-between">
                                {
                                    groupdedDiseases[disease].symptoms.map((symptom:any,index: number) => {
                                        return (
                                            <li key={index} >
                                                <p className="text-blue-500 hover:text-blue-800">{symptom.hasStar && '*'}{symptom.symptomUri.split(healthUri)[1]}</p>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    )
                })
            }
        </div>
    </>
  )
}

export default PatientDiseases