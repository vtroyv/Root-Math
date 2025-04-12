import SingleMfe from "./singleMfe";
import ImageWithEnlarge from "../ImageWithEnlarge";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function QuestionImage({ url, alt, caption, width = 600, height = 400, part, task, mfeHeight = '50%'}) {
    console.log('The part is and the component is questionIMage ', part)
    return (
        <div style={{marginBottom:'0.5rem'}}>
            <div style={{margin:'0.5rem'}}><h3 style={{fontWeight:'bold'}}><Latex>{task.title}</Latex></h3></div>
            <ImageWithEnlarge url={url} alt={alt} caption={caption} width={width} height={height} />
            <SingleMfe part={part}  mfeHeight={mfeHeight}/>
        </div>
    );
}
