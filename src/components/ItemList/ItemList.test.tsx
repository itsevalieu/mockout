import { render, screen } from "@testing-library/react";
import ItemList, { ItemListProps } from "./ItemList";

const itemListData: ItemListProps = {
  filteredTopics: ["javascript", "node.js"],
  items: [
    {
      question: "Test question?",
      answer: "Test answer.",
      categories: ["javascript", "node.js"],
      link: ["www.google.com"],
    },
  ],
};
test("renders categories if filteredTopics is not empty", async () => {
  render(
    <ItemList
      filteredTopics={itemListData.filteredTopics}
      items={itemListData.items}
    />
  );
  const categoriesEl = await screen.findByTestId("categories");
  expect(categoriesEl).not.toHaveTextContent(/flashcard/i);
});

//categories show without flashcard
//item list displays none if empty item
//item list displays stuff
