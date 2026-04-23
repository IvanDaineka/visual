import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './components/BookCard';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedCovers, setLoadedCovers] = useState(0);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchBookCover = async (isbn) => {
    if (!isbn) return null;
    
    try {
      const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      
      const response = await axios.get(coverUrl, {
        responseType: 'blob',
        timeout: 5000,
        headers: {
          'Accept': 'image/jpeg,image/jpg,image/png,image/webp'
        }
      });
      
      if (response.data && response.data.size > 1000 && response.data.type.includes('image')) {
        console.log(`✅ Обложка загружена для ISBN: ${isbn}`);
        return response.data;
      }
      
      console.log(`❌ Обложка не найдена для ISBN: ${isbn}`);
      return null;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`📚 Обложка отсутствует для ISBN: ${isbn}`);
      } else {
        console.error(`Ошибка загрузки обложки для ISBN ${isbn}:`, error.message);
      }
      return null;
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadedCovers(0);
      
      let booksData;
      
      try {
        console.log('Загрузка данных о книгах...');
        const response = await axios.get('https://fakeapi.extendsclass.com/books', {
          timeout: 10000
        });
        booksData = response.data;
        console.log(`Загружено ${booksData.length} книг из API`);
      } catch (apiError) {
        console.log('API недоступен, использую тестовые данные');
        booksData = getMockBooks();
      }
      
      const limitedBooks = booksData;
      
      const booksWithCovers = [];
      
      for (let i = 0; i < limitedBooks.length; i++) {
        const book = limitedBooks[i];
        let coverBlob = null;
        
        if (book.isbn) {
          console.log(`Загрузка обложки ${i + 1}/${limitedBooks.length} для книги: ${book.title}`);
          coverBlob = await fetchBookCover(book.isbn);
          setLoadedCovers(i + 1);
          
          if (i < limitedBooks.length - 1) {
            await delay(300);
          }
        }
        
        booksWithCovers.push({
          ...book,
          coverBlob
        });
      }
      
      setBooks(booksWithCovers);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки книг:', err);
      setError('Не удалось загрузить книги. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Загрузка книг... {loadedCovers > 0 && `(${loadedCovers}/80 обложек)`}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(loadedCovers / 12) * 100}%` }}
          ></div>
        </div>
        <p className="loading-hint">Используется OpenLibrary API</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchBooks} className="retry-button">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Каталог книг</h1>
        <p className="book-count">Найдено книг: {books.length}</p>
        <p className="api-info">Обложки предоставлены OpenLibrary</p>
      </header>
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            coverImage={book.coverBlob}
          />
        ))}
      </div>
    </div>
  );
}

export default App;