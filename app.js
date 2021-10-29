// Start by mapping everything out:
// Book Class: Represents a Book
// UI Class: Handles UI Tasks - display book, remove book, show messages
// Store Class: Handles Storage - local, persists in browser
// Events: Display Books; Add a Book; Remove a Book

// Create a Book class
// - won't need this until "Add a Book" event, but it's an easy start point
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class to handle UI tasks 
// - display book, add book to list, remove book from list, show message
// - don't want to instantiate the UI class, so using static methods
class UI {

    static displayBooks() {
        const StoredBooks = [
            {
                title: 'Book One',
                author: 'John Doe',
                isbn: '34343434'
            },
            {
                title: 'Book Two',
                author: 'Jane Doe',
                isbn: '45454545'
            }
        ];

        const books = StoredBooks;

        books.forEach(book=>UI.addBookToList(book));
    }
}