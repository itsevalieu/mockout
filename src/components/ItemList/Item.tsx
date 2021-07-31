import { useEffect, useState } from "react";
import "./Item.scss";
import ReactMarkdown from "react-markdown";

export interface ItemProps {
    question: string,
    answer: string,
    categories: any[],
    link: string[],
}
const Item = (item: ItemProps, key: any) => {
    const [expand, setExpand] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    useEffect(() => {
        let index = item.categories.findIndex(category => category === "flashcard");
        item.categories.splice(index, 1);
        setCategories(item.categories);
    }, [item]);
    return (
        <li 
            className="Item" onClick={(e: any) => setExpand(!expand)}> 
            <div className="question">
                <p>{item.question}</p>
                <ul className="categories">{categories.map(((category, index) => <li key={index}>{category}</li>))}</ul>

            </div> 
            {
                expand ? 
                <div className="answer">
                    <div className="answer-body"><ReactMarkdown>{item.answer}</ReactMarkdown></div>
                    {/* <ul>{item.link.map((link, index) => <li key={index}>{link}</li>)}</ul> */}
                </div> 
                :
                null
            }
        </li>
    );
}
 
export default Item;