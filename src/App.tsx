import { useState } from "react";
import './App.scss';
import Hero from "./components/Hero";
import Item from "./components/Item";

const App = () => {
  const [items, setItems] = useState([
    {
      question: "What is the difference between the DOM and Virtual DOM?",
      answer: "The DOM is a component tree that the browser creates and updates as a whole everytime an element changes.\n The Virtual DOM is a copy of this component tree and only updates the specific element that changes.",
      category: "React",
      link: ["www.youtube.com/what-is-the-dom", "www.google.com/what-is-the-dom"]
    },
    {
      question: "What is the difference between the DOM and Virtual DOM?",
      answer: "The DOM is a component tree that the browser creates and updates as a whole everytime an element changes.\n The Virtual DOM is a copy of this component tree and only updates the specific element that changes.",
      category: "React",
      link: ["www.youtube.com/what-is-the-dom"]
    }
  ]);

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
