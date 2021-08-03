import "./ItemList.scss";
import Item from "./Item";

export interface ItemListProps {
  filteredTopics: string[];
  items: any[];
}
const ItemList = ({ filteredTopics, items }: ItemListProps) => {
  return (
    <div>
      {items.length === 0 ? null : (
        <>
          <div className="description">
            <h3>Practice Interview Questions</h3>
            <p>
              Based on the pasted job description, here are some practice
              interview questions that were generated below:
            </p>
            <h4>Topics Include:</h4>
            <div id="categories" data-testid="categories">
              {filteredTopics.length === 0 ? (
                <span>None</span>
              ) : (
                filteredTopics.map((topic, index) => (
                  <span className="topics" key={index}>
                    {topic + " "}
                  </span>
                ))
              )}
            </div>
            <br />
          </div>
          <div className="ItemList">
            <ul data-testid="items">
              {items.map((item, index) => (
                <Item key={index} {...item} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemList;
