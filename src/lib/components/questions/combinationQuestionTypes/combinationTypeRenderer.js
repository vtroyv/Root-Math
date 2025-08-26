'use client'
import CombinationImageWithMfe from "./imageWithMfe";
import CombinationSketch from "./sketch";
import CombinationExplain from "./explain";

export default function CombinationTypeRenderer({key,block}) {

    console.log('the b')
    switch (block.type) {
        case 'imageWithMfe': {
            return(
                <div style={{marginTop:'0.5rem'}}>
                    <CombinationImageWithMfe questionDetails={block}/>
                </div>
            )
        }

        case 'sketch': {
            return( <div style={{marginTop:'0.5rem'}}> <CombinationSketch questionDetails={block}/></div>)
        }

        case 'explain': {
            return(
            <div style={{marginTop:'0.5rem'}}>
                <CombinationExplain questionDetails={block}/>
            </div>
            )
        }

        

        default:
            return null;
    }

}