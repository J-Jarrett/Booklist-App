// Start by mapping everything out:
// Book Class: Represents a Book
// UI Class: Handles UI Tasks - display book, remove book, show messages
// Store Class: Handles Storage - local, persists in browser
// Events: Display Books; Add a Book; Remove a Book

// Create a Book class
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class to handle UI tasks 
class UI {

    static displayBooks() {
       
        const books = Store.getBooks();
        books.forEach(book=>UI.addBookToList(book));

    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
        
        list.appendChild(row);
    }

    static deleteBook(el) {
        // passing in e.target from Event: Remove a Book
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-2`;
        div.appendChild(document.createTextNode(message));

        
        const container = document.querySelector('.container');
        const form = document.querySelector('form');
        container.insertBefore(div, form);

        // Alert message to vanish after 3 seconds:
        setTimeout(()=>document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        // this will empty form fields after book is submitted to be included in list table (part of displayBooks())
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
}  // end class UI


// Store Class: Handles Storage - local, persists in browser
// needs 3 methods: getBooks(), addBook(book) and removeBook(isbn)
// remember storage is as JSON, so need to stringify to store and parse to access and manipulate.

class Store {

    static getBooks() {

        let books;

        if (localStorage.getItem('books')===null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;

    }  // end getBooks()

    static addBook(book) {

        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    
    }  // end addBook(book)

    static removeBook(isbn) {

        const books = Store.getBooks();

        books.forEach((book,index)=>{
            if (book.isbn===isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }  // end removeBook(isbn)

} // end class Store

// ====================================

// Events: Display Books; Add a Book; Remove a Book

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', e=> {
    e.preventDefault();

    // get form VALUES and assign to vars
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // 
    // const book = new Book(title, author, isbn);

    // VALIDATION 
    if (title === '' || author === '' || isbn === '') {
      
        UI.showAlert('Please fill in all fields', 'danger');

    } else {
        // instantiate a book object
        const book = new Book(title, author, isbn);
        // add book to display
        UI.addBookToList(book);
        // add book to local storage
        Store.addBook(book);
        // show success message
        UI.showAlert('Book Added', 'success');
        // clear out the fields of user input
        UI.clearFields();
    }
})

// Event: Remove a Book
document.querySelector('#book-list')
    .addEventListener('click', (e)=>{
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
    // show success message:
    UI.showAlert('Book Removed', 'success');
})
