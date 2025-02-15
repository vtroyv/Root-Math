
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { getQuestions } from '@/lib/mongodb/utils';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import QuestionTable from '@/lib/components/questions/QuestionTable';









export default async function Questions() {

  // const questions = await fetchQuestions()
  // console.log('the questions are ', questions)


  return (
    <>
    <h1 style={{fontWeight:'bold', color:'#17a2b8'}}>Questions By Topic </h1>
    <QuestionTable />
    </>

  );
}
