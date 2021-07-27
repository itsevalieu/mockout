import { useState } from "react";
import "./Item.scss";

type ItemProps = {
    question: string,
    answer: string,
    category: string,
    link: string[],
}
const Item = (item: ItemProps, key: any) => {
    const [expand, setExpand] = useState(false);
    return (
        <li 
            className="Item" onClick={(e: any) => setExpand(!expand)}> 
            <div className="question">
                    <p>{item.question}</p>
                    <p>{item.category}</p>
                </div> 
            {
                expand ? 
                <div className="answer">
                    <p>{item.answer}</p>
                    <ul>{item.link.map((link, index)=><li key={index}>{link}</li>)}</ul>
                </div> 
                :
                null
            }
        </li>
    );
}
 
export default Item;