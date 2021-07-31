import { fireEvent, render, screen } from '@testing-library/react';
import Item, { ItemProps } from './Item';

let item: ItemProps = {
    question: "Test question?",
    answer: "Test answer.",
    categories: ["javascript", "node.js", "flashcard"],
    link: ["www.google.com"]
};

test('Should toggle to show/hide answer', () => {
    render(<Item {...item}/>);
    //before clicking on the Item, the answer div should not be visible
    expect(screen.getByTestId(item.question)).not.toContainElement(screen.queryByText(item.answer));
    fireEvent.click(screen.getByTestId(item.question));
    expect(screen.queryByText(item.answer)).toBeVisible();
});

test('categories are listed without flashcard', () => {
    render(<Item {...item}/>);
    const categoryEl = screen.getByTestId('category');
    expect(categoryEl).not.toHaveTextContent(/flashcard/i);
});
