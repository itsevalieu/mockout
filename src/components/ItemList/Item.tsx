import { useEffect, useState } from "react";
import "./Item.scss";
import ReactMarkdown from "react-markdown";

export interface ItemProps {
    question: string,
    answer: string,
    categories: any[],
    link: string[],
}
const Item = (item: ItemProps) => {
    const [expand, setExpand] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    useEffect(() => {
        let index = item.categories.findIndex(category => category === "flashcard");
        item.categories.splice(index, 1);
        setCategories(item.categories);
    }, [item]);
    return (
        <li 
            data-testid={item.question} className="Item" onClick={(e: any) => setExpand(!expand)}> 
            <div className="question">
                <p>{item.question}</p>
                <ul className="categories">{categories.map(((category, index) => <li data-testid="category" key={index}>{category}</li>))}</ul>

            </div> 
            {
                expand ? 
                <div className="answer">answer
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