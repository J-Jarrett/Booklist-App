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
        // // StoredBooks will be in local storage later, this is just hard coded here for testing/checking
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '34343434'
        //     },
        //     {
        //         title: 'Book Two',
        //         author: 'Jane Doe',
        //         isbn: '45454545'
        //     }
        // ];

        // const books = StoredBooks;
        // books.forEach(book=>UI.addBookToList(book));


        // Now that we've done the class Store, can implement localStorage instead of hard coding:

        const books = Store.getBooks();

        books.forEach(book=>UI.addBookToList(book));

    }

    static addBookToList(book) {
        // create a row tr to add to body of table tbody; first assign #book-list to a var, then create row element
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        
        // now create the columns in each row:
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
        
        // we've selected list from DOM and created a row with content from passed in params and formatted it, now add the row to the list:
        list.appendChild(row);

        // now all we have to do is call displayBooks(); it will take the books we have hard coded, loop through them and add each to the list using addBookToList().
        // call displayBooks() through event listener Display Books
    }

    static deleteBook(el) {
        // passing in e.target from Event: Remove a Book
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            // the parent of e.target is <td>, and the parent of <td> is <tr>, or the entire row.
            // so we targeted the whole #book-list, and then removed the parent of the parent of the element containing the class "delete"
        }
    }

    static showAlert(message, className) {
        // because we don't have the message element in our UI/html, need to create it, add classes, and append a textNode containing the words of the message:
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-2`;
        div.appendChild(document.createTextNode(message));

        // next we need to figure out how & where to insert message into DOM, here we're putting it under the title <h1> and just before the <form #book-form>, so:
        // we want to grab the parent element that contains these (container), then the element to place message before (form)
        // these seem the wrong way round in insertBefore, but it goes (what we're putting in, where we're putting it before) or (insert[what], Before[what])
        const container = document.querySelector('.container');
        const form = document.querySelector('form');
        container.insertBefore(div, form);

            // (there is no "insertAfter" method, but there is nextSiblingElement() but it's complicated, see MDN docs)
        
        //so that's good, but it just stays there, and if you test it several times it duplicates and persists.
        // We don't want that. We want it to Go Away after, say, 3 seconds.

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
        // initialized here so can manipulate within scope of if/else and return result after that; must be let, const doesn't allow an empty initialization.

        if (localStorage.getItem('books')===null) {
            books = [];
            // if we have nothing in storage, set var books to an empty array ready to add book objects to it.
        
        } else {
            //books.localStorage.getItem('books');
            // this is not enough, will throw a data type error; we've only pulled out the JSON, which is a string, and need use parse method to convert it to a regular JS array of objects

            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;

    }  // end getBooks()

    // we're adding a single book object passed in
    static addBook(book) {

        const books = Store.getBooks();
        // using the method above to get any books in storage into a usable format

        books.push(book);

        // now we need to reset the localStorage with this new book object added on; remember because stored item 'books' is a string, need to now stringify it; goes ('Key (a string)', 'Value (a string)')

        localStorage.setItem('books', JSON.stringify(books));
    
    }  // end addBook(book)


    // we're identifying book obj to remove by the unique id ISBN (because authors write many books and many books have the same titles, but ISBN numbers are unique to each book)
    static removeBook(isbn) {

        const books = Store.getBooks();
        // first let's grab the array of book objects from storage using the getBooks() method we wrote above.

        books.forEach((book,index)=>{
            // this will loop through the array of books and access each book object and its index in the array.

            if (book.isbn===isbn) {
                // if the current book object's property isbn matches/is equivalent to the isbn passed in, then...

                books.splice(index, 1);
                // the splice mutates the array books by removing items starting at the index of this book object in array books, to the value passed in next, i.e. 1 item/book object. Returned value could be assigned to a var if required later (e.g. checklist of books removed this session for review)
                // note: slice() would not mutate the array and the returned value would have to be assigned to a var. Not sure if it would be in scope for later use, would have to code it as a "return [var of slice()]"

            }

        });

        // now set our modified books array back into local storage, after stringifying it to match storage data type:

        localStorage.setItem('books', JSON.stringify(books));

    }  // end removeBook(isbn)


    // So that's all our methods to get, add and remove items from localStorage using Store class. 
    // Next we need to implement them by adding them to our Events,
    // so the changes are actioned and persist locally.

} // end class Store

// =======================================
// Quick test for local storage (after you've added a few books):
// open devtools; select Application; select Storage; select Local Storage; select local host (http://127.0.0.1:5500)
// note how within Key books, the value has every item within array as a string, i.e. the key of key/value pairs is also a string; JSON.parse will take these back to property names without "" so accessable with dot notation, i.e. book.isbn, book.title, books[i].isbn, books[i].author, etc
// =======================================



// Events: Display Books; Add a Book; Remove a Book

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// next we want to add a book to the list using the form and then display it in the list, so:
// select form; collect data from form; instantiate a new Book object; call addBookToList

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', e=> {
    e.preventDefault();

    // get form VALUES and assign to vars
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // // instantiate a book object
    // const book = new Book(title, author, isbn);

    // VALIDATION 
    // (ADDED after finishing Delete a Book):
    // - set the vars (above), but before actually instantiating a book object, need to send an alert message to tell user to fill in all fields in the form. 

    if (title === '' || author === '' || isbn === '') {
        // alert('Please fill in all fields');

        // // this sends the ugly looking alert message, we want something better that we can control, built in the UI class
        // // UI: a new static method, showAlert, to receive the message and className

        // after building showAlert in UI, need to CALL method here and pass in the message and a class to set colour, "danger", "info", "success" for red, blue, green

        UI.showAlert('Please fill in all fields', 'danger');

    } else {
        // instantiate a book object
        const book = new Book(title, author, isbn);
        // Add new book to UI (so it displays in list):
        UI.addBookToList(book);

        // Add book to localStorage 
        // this is after creating class Store and its methods:
        Store.addBook(book);

        // (test it! now nothing in list, so fill in fields, book should add to list, success message should show for 3 seconds, reload to see book persists in list because of localStorage)

        // After sorting out the showAlert for unfilled fields, let's add a message for successfully adding a book to the list:
        // show success message
        UI.showAlert('Book Added', 'success');

        // test success message by adding something to list; should get a success message that goes away after 3 seconds
        // note to self: this is fine, but might be better lower or even replacing the Add Book button/link thing

        // clear out the fields of user input
        UI.clearFields();
    }
    



    // // instantiate a book object
    // const book = new Book(title, author, isbn);
    // // test by filling in form fields & submitting:
    // console.log(book);
    // // it only "flashes" in console; need to prevent default submit behaviour with e.preventDefault() at top.
    // // now we have a new Book object!

    // // Add new book to UI (so it displays in list):
    // UI.addBookToList(book);

    // // on reload this book object will vanish because it isn't persisted in local storage;
    // // also notice that form fields are still filled with the input, need to clear those out as part of UI, add clearFields() static method to UI class
    // UI.clearFields();
})

// 

// Event: Remove a Book
// Deleting: trickier than it looks
// There are multiple elements with the class of "delete", so we can't just target that for the click event because it will only delete the first one it meets.
// Need to use Event Propagation: a fancy way of saying to select something above that element with "delete" class, in this case the #book-list <tbody>, and then target whatever is clicked inside the selection.

// Event: Remove a Book
document.querySelector('#book-list')
    .addEventListener('click', (e)=>{
    //     console.log(e.target);
    // })
    // see in console, if you click on any element in a row, e.g. Author Jane Doe, it returns that element: <td>Jane Doe</td>, or isbn, or the <a> containing class="btn etc..." and X.
    // We're going to pass this target to a method on the UI called deleteBook(), a static method just above clearFields() method.
    
    UI.deleteBook(e.target);

    // After writing class Store, can now access removeBook(isbn)
    // PAY ATTENTION THIS IS TRICKY:
        // Store.removeBook() operates on a passed in ISBN.
        // How do we get the isbn from this row?
        // Store.removeBook(e.target) gives us the <a> link containing X that we clicked on. 
        // Store.removeBook(e.target.parentElement) gives us the <td> containing the <a> link we clicked on.
        // We want the previous ELEMENT sibling <td>${book.isbn}</td> AND the .textContent or .innerText, ${book.isbn}
    Store.removeBook(e.target.parentElement.previousElementSibling.innerText);

    // so i did that wrong the first time and called .previousSibling.
    // The difference between previousElementSibling and previousSibling, is that previousSibling returns the previous sibling node as an element node, a text node or a comment node, while previousElementSibling returns the previous sibling node as an element node (ignores text and comment nodes).
    // Now it works. :)

    // after writing static method showAlert and using it in "you forgot to fill in the fields" and "successfully added a book", need another one here to tell user a book has been deleted:

    // show success message:
    UI.showAlert('Book Removed', 'success');

    // again, should see book disappear from list and success message last for 3 seconds.
    // However... on reload, the book will reappear because it is hard coded, not in local storage, so we need to make a Store class to handle storage and call methods to get, add and remove books in that storage.

    // another note to self: perhaps an "undo" option: "Are you sure you want to delete this book?" just in case user clicks on wrong one.

})
