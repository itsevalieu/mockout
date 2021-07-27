import { useState, useEffect } from "react";
import './App.scss';
import Hero from "./components/Hero";
import Item, { ItemProps } from "./components/Item";


const App = () => {
  const api: string = process.env.REACT_APP_API_URL || "";
  // const options = {
  //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //     headers: {
  //       'Content-Type': 'text/plain'
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     }
  // };
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    console.log("UseEffect");
    const fetchFlashcards = () => {
      console.log(api);
      fetch(api).then((res) => {
          return res.json();
      }).then((issues) => {
        
        let flashcards: any[] = [];
        console.log("issues", issues);
        for(let issue of issues) {
          let flashcard: ItemProps = {
            question: issue.title,
            answer: issue.body,
            categories: [...issue.labels],
            link: []
          }
          flashcards.push(flashcard);
        }
        console.log("Check", flashcards);
        setItems(flashcards);
      });
    }
    fetchFlashcards();
    return () => console.log("Unmount");
  }, [api]); 
  
  //fetchFlashcards
  //handleFormSubmit
  //removeStopWords
  //transformWords
  //countWords
  //filterCategories -> return []
  
  return (
    <div className="App">
      <Hero/>
      <main className="FormSection">
        <div className="container">
          <form>
            <textarea placeholder="Insert Job Description text"/>
            <button type="submit">Generate</button>
          </form>
          <div>
            <div className="description">
              <h3>Practice Interview Questions</h3>
              <p>Based on the pasted job description, here are some practice interview questions that were generated below:</p>
              <h4>Topics Include:</h4>
              <div id="categories"></div>
            </div>
            <div className="ItemList">
              <ul>
                {items.map((item, index) => <Item key={index} {...item}/>) }
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
