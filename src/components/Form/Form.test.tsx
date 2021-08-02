import { ReactNode } from "react";
import axios from "axios";
import { render, screen } from "@testing-library/react";
import Form from "./Form";
import { useQuery } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";
import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
type Props = {
  children: ReactNode;
};
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
const fetchGitIssues = async (url: string) => {
  const { data } = await axios(url);
  // let cleanedData = cleanData(data);
  // console.log("cleanedData", cleanedData);
  // setFetchedItems(cleanedData);
  return data;
};
const useCustomHook = (api: string) => {
  return useQuery(["fetchGitIssues", api], () => fetchGitIssues(api));
};
test("renders form component", async () => {
  const api: string = process.env.REACT_APP_API_URL || "";
  // const api: string = "/repos/itsevalieu/mockout/issues";
  const scope = nock(process.env.REACT_APP_BASE_URL || "")
    .get(process.env.REACT_APP_API_ENDPOINT || "")
    .reply(200, {
      data: 42,
    });
  const { result, waitForNextUpdate } = renderHook(() => useCustomHook(api), {
    wrapper: createWrapper(),
  });
  await waitForNextUpdate();
  console.log("checkecheck", result.current);
  // await waitForNextUpdate();
  // console.log("checkecheck", result);
  // await waitFor(() => result.current.isSuccess);
  // expect(result.current).toBeDefined();
});

//form textarea submit on empty, shows error statement
//https://react-query.tanstack.com/guides/testing

// const itemListData: ItemListProps = {
//     filteredTopics: ["javascript", "node.js"],
//     items: [
//         {
//             question: "Test question?",
//             answer: "Test answer.",
//             categories: ["javascript", "node.js"],
//             link: ["www.google.com"]
//         },
//     ],
// }
