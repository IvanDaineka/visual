import React, { useState, useEffect } from 'react';
import './BookCard.css';

const BookCard = ({ title, authors, coverImage }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (coverImage instanceof Blob) {
      const url = URL.createObjectURL(coverImage);
      setImageUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [coverImage]);

  return (
    <div className="book-card">
      <div className="book-cover">
        {imageUrl ? (
          <img src={imageUrl} alt={`${title} cover`} />
        ) : (
          <div className="placeholder-cover">
            <span>No cover</span>
          </div>
        )}
      </div>
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">{authors.join(', ')}</p>
    </div>
  );
};

export default BookCard;