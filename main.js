import './style.css';
import 'normalize.css';

class Book {
  constructor(title, author, status) {
    this.title = title;
    this.author = author;
    this.status = status;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  getBook(title) {
    return this.books.find((book) => book.title === title);
  }

  changeStatus(title) {
    const book = this.getBook(title);
    book.status = book.status === 'Read' ? 'Not read' : 'Read';
  }

  isInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title);
  }

  render() {
    bookTableBody.textContent = '';
    library.books.map((book) => {
      const htmlBook = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="status-button" data-status="${book.title}">${book.status}</button></td>
        <td><button class="delete" data-delete="${book.title}">Delete</button></td>
      </tr>
      `;
      bookTableBody.insertAdjacentHTML('afterbegin', htmlBook);
    });
  }
}

const library = new Library();

// get Element
const bookTableBody = document.getElementById('bookTableBody');
const addBookForm = document.getElementById('addBookForm');
addBookForm.addEventListener('submit', handleSubmit);

//action
bookTableBody.addEventListener('click', (e) => {
  if (e.target) {
    if (e.target.matches('.delete')) {
      library.removeBook(e.target.dataset.delete);
      updateLocal();
      library.render();
    }
    if (e.target.matches('.status-button')) {
      library.changeStatus(e.target.dataset.status);
      updateLocal();
      library.render();
    }
  }
});

function handleSubmit(e) {
  e.preventDefault();
  const formElements = Array.from(e.target.elements);
  const title = formElements[0].value;
  const author = formElements[1].value;
  const status = formElements[2].value;
  const book = new Book(title, author, status);
  if (library.isInLibrary(book)) {
    alert('This book already exists in your library');
  }
  library.addBook(book);
  updateLocal();
  addBookForm.reset();
  library.render();
}

// Local Storage
const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.status);
};

const updateLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books));
};

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('library'));
  if (books) {
    library.books = books.map((book) => JSONToBook(book));
  } else {
    library.books = [];
  }
};

restoreLocal();
library.render();
