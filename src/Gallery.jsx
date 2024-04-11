import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobalContext } from "./Context";

const url = `https://api.unsplash.com/search/photos?client_id=${
  import.meta.env.VITE_API_KEY
}`;

const Gallery = () => {
  const { searchTerm } = useGlobalContext();
  const [page, setPage] = useState(1); // State to manage current page

  const response = useQuery({
    queryKey: ["images", searchTerm, page], // Include page in query key
    queryFn: async () => {
      const result = await axios.get(`${url}&query=${searchTerm}&page=${page}`);
      return result.data;
    },
  });

  const handleNextPage = () => {
    setPage(page + 1); // Increment page number
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1); // Decrement page number if it's greater than 1
    }
  };

  if (response.isLoading) {
    return (
      <section className="image-container">
        <h4>Loading...</h4>
      </section>
    );
  }
  if (response.isError) {
    return (
      <section className="image-container">
        <h4>There was an Error...</h4>
      </section>
    );
  }
  const result = response.data.results;
  if (result.length < 1) {
    return (
      <section className="image-container">
        <h4>No results found...</h4>
      </section>
    );
  }

  return (
    <>
    <section className="image-container">
      
      {result.map((items) => {
        const url = items?.urls?.regular;
        return (
          <img
            src={url}
            alt={items.alt_description}
            key={items.id}
            className="img"
            
          />
        );
      })}
      
    </section>
    <div className="pagination" style={{textAlign:"center",marginTop:"2rem", marginBottom:"2rem"}}>
    <button onClick={handlePrevPage} disabled={page === 1} className="button-33" style={{marginRight:"2rem"}}>
      Previous
    </button>
    <button onClick={handleNextPage} className="button-33">Next</button>
  </div>
  </>
  );
};

export default Gallery;



