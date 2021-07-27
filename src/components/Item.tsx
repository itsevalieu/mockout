import { useState } from "react";
import "./Item.scss";

export interface ItemProps {
    question: string,
    answer: string,
    categories: any[],
    link: string[],
}
const Item = (item: ItemProps, key: any) => {
    const [expand, setExpand] = useState(false);
    return (
        <li 
            className="Item" onClick={(e: any) => setExpand(!expand)}> 
            <div className="question">
                <p>{item.question}</p>
                <ul>{item.categories.map((category, index) => <li key={index}>{category.name}</li>)}</ul>
            </div> 
            {
                expand ? 
                <div className="answer">
                    <p>{item.answer}</p>
                    {/* <ul>{item.link.map((link, index) => <li key={index}>{link}</li>)}</ul> */}
                </div> 
                :
                null
            }
        </li>
    );
}
 
export default Item;