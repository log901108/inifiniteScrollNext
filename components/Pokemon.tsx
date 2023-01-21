import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { getPoke } from "../api";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export const Pokemon = () => {
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    "poke",
    ({ pageParam = "" }) => getPoke(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const lastOffset =
          lastPage.results[lastPage.results.length - 1].url.split("/")[6];
        if (lastOffset > 1118) {
          return undefined;
        }
        return lastOffset;
      },
      staleTime: 3000,
    }
  );

  //! https://driip.me/7126d5d5-1937-44a8-98ed-f9065a7c35b5
  const loadMoreButtonRef = React.useRef(null);

  useIntersectionObserver({
    root: null,
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <>
      <ul>
        {data?.pages.map((page) =>
          page.results.map((poke: any) => (
            <li key={poke.name} style={{ padding: "20px", fontWeight: "bold" }}>
              {poke.name}
            </li>
          ))
        )}
      </ul>
      <button onClick={() => fetchNextPage()}>Load More</button>
      <div ref={loadMoreButtonRef} />
    </>
  );
};
