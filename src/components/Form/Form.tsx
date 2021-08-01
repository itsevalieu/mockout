import axios from "axios";
import './Form.scss';
import { useRef } from "react";
import { useState, useEffect } from "react";
import { ItemProps } from "../ItemList/Item";
import ItemList from "../ItemList/ItemList";
import { useQuery } from 'react-query';
const sw = require("stopword");
const topics = [
    "javascript",
    "react",
    "frontend",
    "css",
    "node",
  ];

const Form = () => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [fetchedItems, setFetchedItems] = useState<any[]>([]);
    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        console.log("2. Submit form start");
        // setLoading(true);
        let textNode = textAreaRef.current || null;
        if(textNode && textNode.value) {
        let cleanedTextArray: string[] = cleanTextInput(textNode.value);
        let hashedMapWords = hashMapWords(cleanedTextArray);
        let newTopics: string[] = await detectTopics(hashedMapWords, topics);
        await filterFlashcardsByTopics(fetchedItems, newTopics);
        // setLoading(false);
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
    const api: string = process.env.REACT_APP_API_URL || "";
    const fetchGitIssues = async (url: string) => {
        const { data } = await axios(url);
        let cleanedData = cleanData(data);
        console.log("cleanedData", cleanedData);     
        setFetchedItems(cleanedData); 
        return cleanedData;
    }
    const cleanData = (items: any) => {
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
      return flashcards;
    }
    const { isLoading, isError, data, error } = useQuery(['gitIssues', api], () => fetchGitIssues(api), {
      staleTime: 3000,
      onSuccess: () => console.log("Data fetched successfully"),
      onError: () => console.log("Error on data fetch"),
    });
    if(isError) {
      return <span>Error: {error}</span>;
    }
    if(isLoading) {
      return <span>Loading...</span>;
    }
    // console.log(data);
    return (
        <main className="FormSection">
            <div className="container">
            <form onSubmit={handleFormSubmit}>
                <textarea ref={textAreaRef} placeholder="Insert Job Description text" autoFocus/>
                <button type="submit">Generate</button>
            </form>
            {
                isLoading ? null: <ItemList filteredTopics={filteredTopics} items={items}/>
            }
            </div>
        </main>
    );
}

export default Form;