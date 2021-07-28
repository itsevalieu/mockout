import { useState, useEffect, useRef } from "react";
import './App.scss';
import Hero from "./components/Hero";
import Item, { ItemProps } from "./components/Item";


const App = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const api: string = process.env.REACT_APP_API_URL || "";
  // const options = {
  //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //     headers: {
  //       'Content-Type': 'text/plain'
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     }
  // };
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    console.log("UseEffect");
    setLoading(true);
    const fetchFlashcards = () => {
      console.log(api);
      fetch(api).then((res) => {
          return res.json();
      }).then((items) => {
       
        let flashcards: any[] = [];
        for(let item of items) {
          if(item.labels.length === 0) continue;
          let flashcard: ItemProps = {
            question: item.title,
            answer: item.body,
            categories: [...item.labels.map((label: any) => label.name)],
            link: []
          }
          flashcards.push(flashcard);
        }
        let filteredFlashcards = filterCategories("flashcard", flashcards);
        setItems(filteredFlashcards);
        setLoading(false);
      });
    }
    setTimeout(fetchFlashcards, 1000);
    return () => console.log("Unmount");
  }, [api]); 
  
  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    console.log("Submit form start");
    if(textAreaRef.current?.value) {
      let text = textAreaRef.current.value;
      console.log(text.length);
    }

  }
  //handleFormSubmit
  //removeStopWords
  //transformWords
  //countWords

  /**
   * Filters categories and returns a list of items with the chosen category
   * @param category 
   * @param items 
   * @returns 
   */
  const filterCategories = (category: string, items: any[]) => {
    console.log("Filtering", category, items);
    return items.filter((item) => {
      for(let i=0; i<item.categories.length;i++) {
        return item.categories[i] === category;
      }
    });
  }
  
  return (
    <div className="App">
      <Hero/>
      <main className="FormSection">
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <textarea ref={textAreaRef} placeholder="Insert Job Description text" autoFocus/>
            <button type="submit">Generate</button>
          </form>
          { isLoading ? 
            <div><p>Loading...</p></div> : 
            <div>
              <div className="description">
                <h3>Practice Interview Questions</h3>
                <p>Based on the pasted job description, here are some practice interview questions that were generated below:</p>
                <h4>Topics Include:</h4>
                <div id="categories"></div>
              </div>
              <div className="ItemList">
                <ul>
                  { items.map((item, index) => <Item key={index} {...item}/>) }
                </ul>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
