import { useState, useEffect, useRef } from "react";
import './App.scss';
import Hero from "./components/Hero/Hero";
import { ItemProps } from "./components/ItemList/Item";
import ItemList from "./components/ItemList/ItemList";
const sw = require("stopword");

const App = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const api: string = process.env.REACT_APP_API_URL || "";
  const topics = [
    "javascript",
    "react",
    "frontend",
    "css",
    "node",
    // "nodejs"
    // "frameworks",
    // "github",
    // "redux",
    // "es6",
  ];
  const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    console.log("UseEffect, Fetch all the github issues");
    const fetchFlashcards = () => {
      console.log(api);
      fetch(api).then((res) => {
          return res.json();
      }).then((items) => {
        let flashcards: any[] = [];
        for(let item of items) {
          if(item.labels.length === 0) continue;
          let categories: string[] = [...item.labels.map((label: any) => label.name)].sort();
          if(categories.includes("flashcard")) {
            let flashcard: ItemProps = {
              question: item.title,
              answer: item.body,
              categories: categories,
              link: []
            }
            flashcards.push(flashcard);
          } else {
            continue;
          }
        }
        console.log("1. Fetched all clean flashcards", flashcards);
        // let filteredFlashcards = filterCategoriesByFlashcard("flashcard", flashcards);
        setFetchedItems(flashcards);
      });
    }
    fetchFlashcards();
    return () => console.log("Unmount");
  }, [api]); 

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    console.log("2. Submit form start");
    setLoading(true);
    let textNode = textAreaRef.current || null;
    if(textNode && textNode.value) {
      let cleanedTextArray: string[] = cleanTextInput(textNode.value);
      let hashedMapWords = hashMapWords(cleanedTextArray);
      let newTopics: string[] = await detectTopics(hashedMapWords, topics);
      await filterFlashcardsByTopics(fetchedItems, newTopics);
      setLoading(false);
      textNode.value = "";
      textNode.focus();
    } else {
      console.log("No job description submitted.");
    }
  }
  /**
   * Cleans textArea input by changing the string to lowercase, then splitting by " "
   * @param text 
   * @returns string[]
   */
  const cleanTextInput = (text: string) => {
    console.log("3. cleanTextInput");
    let cleanedWords = text.trim().toLowerCase().replace(/[^\w\s]|_/g, "").split(" ").sort();
    return removeStopWords(cleanedWords);
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
  const hashMapWords = (textArray: string[]) => {
    console.log("4. hashMapWords");
    const hashArray = new Map();
    for(let word of textArray) {
      if(hashArray.has(word)) {
        hashArray.set(word, (hashArray.get(word))+1);
      } else {
        hashArray.set(word, 1);
      }
    }
    console.log("4a. hashArray", hashArray);
    return hashArray;
  }

  //detectTopics: compare hashMap keys with flashcardtopics
  const detectTopics = (hashedTextArray: any, topics: string[]) => {
    console.log("5. detectTopics");
    const p = new Promise<string[]>(async (resolve, reject) => {
      let cleanedTopics: string[] = await topics.filter(topic => hashedTextArray.has(topic));
      setFilteredTopics(cleanedTopics);
      console.log("5a filteredTopics can't be empty", cleanedTopics);
      resolve(cleanedTopics);
    });
    return p;
  }
  
  //todo
  const filterFlashcardsByTopics = (items: any[], topics: string[]) => {
    console.log("6. filteredFlashcardsByTopics", items, topics);
    let newItems = items.filter((item, index) => {
      console.log("6a. item: ", index, item.categories); 
      return topics.some(topic => {
        console.log("6a. topic: ", topic);
        return item.categories.includes(topic);
      });
    });
    setItems(newItems);
    console.log("Newly filtered", newItems);
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
          {
            isLoading ? <div><p>Loading...</p></div> : <ItemList filteredTopics={filteredTopics} items={items}/>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
