import './App.scss';
import Hero from "./components/Hero";

function App() {
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
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
