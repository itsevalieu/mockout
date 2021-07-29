import { useState, useEffect, useRef } from "react";
import { Map } from "typescript";
import './App.scss';
import Hero from "./components/Hero";
import Item, { ItemProps } from "./components/Item";
const sw = require("stopword");

const App = () => {
  const availableTopics = [
    "javascript",
    "react",
    "frontend",
    // "frameworks",
    // "github",
    // "redux",
    // "es6",
    "css",
  ];
  const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
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
        console.log("XXX. Fetched all clean flashcards", flashcards);
        let filteredFlashcards = filterCategoriesByFlashcard("flashcard", flashcards);
        setItems(filteredFlashcards);
      });
    }
    fetchFlashcards();
    return () => console.log("Unmount");
  }, [api]); 
  
  const filteredFlashcardsByTopics = (items: any[]) => {
    let newItems = items.filter((item, index) => {
      console.log("5. filter flashcards by categories if it includes the topics, items:", items);
      console.log("6. filteredTopics", filteredTopics);
      for(let topic of filteredTopics) {
        console.log("7. topic in category,", index, topic, item.categories);
        return item.categories.includes(topic);
      }
    });

    setItems(newItems);
    console.log("Newly filtered", newItems);
  }
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Submit form start");
    let textNode = textAreaRef.current || null;
    if(textNode && textNode.value) {
      setLoading(true);
      let textArray: string[] = cleanText(textNode.value);
      textArray = removeStopWords(textArray);
      let hashedTextArray = hashWords(textArray);
      console.log("1. hashedTextArray", hashedTextArray);
      await detectTopics(hashedTextArray, availableTopics);
      console.log("3. detectopics stopped?");
      console.log("4. ===before filtered flashcards by topic", filteredTopics);
  
      await filteredFlashcardsByTopics(items);
      setLoading(false);

      textNode.value = "";
      textNode.focus();
    } else {
      console.log("No job description submitted.");
    }
  }
  //detectTopics: compare hashMap keys with flashcardtopics
  const detectTopics = (hashedTextArray: any, availableTopics: string[]) => {
    let filteredTopics = availableTopics.filter(topic => {
      return hashedTextArray.has(topic);
    });
    setFilteredTopics(filteredTopics);
    console.log("2. detectTopics filteredTopics", filteredTopics);
  }
  /**
   * Cleans textArea input by changing the string to lowercase, then splitting by " "
   * @param text 
   * @returns string[]
   */
  const cleanText = (text: string) => {
    return text.trim().toLowerCase().replace(/[^\w\s]|_/g, "").split(" ").sort();
  }
  /**
   * Removes stop words like an, a, the, etc from the textArray 
   * @param textArray 
   * @returns string[]
   */
  const removeStopWords = (textArray: string[]) => {
    return sw.removeStopwords(textArray);
  }
  /**
   * Hashmaps the textArray and counts each word
   * @param textArray 
   * @returns hashmap
   */
  const hashWords = (textArray: string[]) => {
    const hashArray = new Map();
    for(let word of textArray) {
      if(hashArray.has(word)) {
        hashArray.set(word, (hashArray.get(word))+1);
      } else {
        hashArray.set(word, 1);
      }
    }
    return hashArray;
  }
  /**
   * Filters categories and returns a list of items with the chosen category
   * @param category 
   * @param items 
   * @returns 
   */
  const filterCategoriesByFlashcard = (category: string, items: any[]) => {
    console.log("FilteringCategories: ", category, items);
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
                <div id="categories">{ filteredTopics.length === 0 ?  <span>None</span> : filteredTopics.map((topic, index) => <span key={index}>{topic}</span>) }</div>
                <br/>
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
