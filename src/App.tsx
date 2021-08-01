import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import './App.scss';
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import Form from "./components/Form/Form";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Hero/>
        <Form/>
        <Footer/>
      </div>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
// /**
//  * Filters categories and returns a list of items with the chosen category
//  * @param category 
//  * @param items 
//  * @returns 
//  */
//   const filterCategoriesByFlashcard = (category: string, items: any[]) => {
//   console.log("FilteringCategories: ", category, items);
//   return items.filter((item) => {
//     for(let i=0; i<item.categories.length;i++) {
//       return item.categories[i] === category;
//     }
//   });
// }