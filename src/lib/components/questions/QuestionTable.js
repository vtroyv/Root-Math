'use client'
import { useState,useEffect } from "react"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Calendar } from "primereact/calendar"
import { MultiSelect } from "primereact/multiselect"
import { useDispatch } from "react-redux"
import { selectQuestion } from "@/lib/redux/slices/questionslice"
import { useRouter } from "next/navigation"
import { useGetQuestionsQuery } from "@/lib/redux/slices/apiSlice"
import { useSelector } from "react-redux"







export default function QuestionTable() {
    

    //hooks
    const dispatch = useDispatch()
    const router = useRouter()
    



    const {data} = useGetQuestionsQuery()

    
    console.log('the questions are', data)

    const topics =[
        {topic:'Proof'}, 
        {topic: 'Algebra and Functions'},
        {topic: 'Coordinate geometry in the (x,y) plane'}, 
        {topic: 'Sequences and Series'},
        {topic: 'Trigonometry'}, 
        {topic: 'Exponentials and Logarithms'}, 
        {topic: 'Differentiation'}, 
        {topic: 'Integration'}, 
        {topic: 'Numerical Methods'}, 
        {topic: 'Vectors'}
    ]


    const filters ={
        'topic': { value: null, matchMode: FilterMatchMode.IN },
    }


   
   
    const topicBodyTemplate =(rowData) =>{
        const topic = rowData.topic
        return (
            <>
            <span>{topic}</span>
            </>
        )

    }

    const topicFilterTemplate =(options) => {
       

        const selectedTopics =  options.value || [];
        console.log('Selected Topics', selectedTopics);

        /*
        MAKE SURE to study  representativeFilterTemplate from the code box 

        */

        
        return(
            <>
                <div><h6>Topic Picker</h6></div>
                <MultiSelect value={selectedTopics} options={topics} itemTemplate={topicsItemTemplate} 
                onChange={(e)=> {
                    console.log('Selected value:', e.value);
                    

                    options.filterCallback(e.value)
                }} 
    
                optionLabel="topic" optionValue="topic" placeholder="Any" />
            </>
        )
    }

    const topicsItemTemplate = (option) => {
        return (
            <div style={{display:'inline-block'}}>
                <span>{option.topic}</span>
            </div>
        )
    }

    const onRowSelect = (event) =>{
        console.log('the event is ', event)
        //perfect, we can use the data element 
        const {title, topic, latex, difficulty, type} = event.data
        dispatch(selectQuestion({title, topic, latex, difficulty, type}))
        router.push(`/questions/${title}`)
    }

    const onRowUnselect = (event) => {
        console.log('we unselected this row')
    }
    
    const questionState = useSelector((state)=> state.api)
    console.log('the questionState is',questionState)



  return (

    <DataTable value={data} filterDisplay="menu" filters={filters} onRowSelect={onRowSelect}  selectionMode='single'>
        <Column field="status" header="Status" ></Column>
        <Column field="title" header="Title"></Column>
        <Column field="topic" header="Topic" filterField="topic"  showFilterMatchModes={false} showFilterOperator={false} showAddButton={false} showApplyButton={true}
        filterMenuStyle={{ width: '14rem' }} body={topicBodyTemplate} filter filterElement={topicFilterTemplate}  ></Column>
        <Column field="difficulty" header="Difficulty"></Column>

        

    </DataTable>
   
  )
}
