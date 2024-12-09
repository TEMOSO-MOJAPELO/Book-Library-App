// Book Library Management System
class BookLibrary {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('books')) || [];
        this.borrowHistory = JSON.parse(localStorage.getItem('borrowHistory')) || [];
        this.renderBooks();
        this.renderCategories();
        this.renderBorrowHistory();
    }

    saveToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
        localStorage.setItem('borrowHistory', JSON.stringify(this.borrowHistory));
    }

    addBook(title, author, category) {
        const book = {
            id: Date.now(),
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            available: true
        };
        this.books.push(book);
        this.saveToLocalStorage();
        this.renderBooks();
        this.renderCategories();
    }

    searchBooks(query) {
        query = query.toLowerCase().trim();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.category.toLowerCase().includes(query)
        );
    }

    lendBook(bookTitle, borrowerName) {
        const book = this.books.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
        if (book && book.available) {
            book.available = false;
            const borrowRecord = {
                bookTitle: book.title,
                borrowerName: borrowerName,
                borrowDate: new Date().toLocaleString()
            };
            this.borrowHistory.push(borrowRecord);
            this.saveToLocalStorage();
            this.renderBooks();
            this.renderBorrowHistory();
            return true;
        }
        return false;
    }

    returnBook(bookTitle) {
        const book = this.books.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
        if (book) {
            book.available = true;
            this.borrowHistory = this.borrowHistory.filter(record => 
                record.bookTitle.toLowerCase() !== bookTitle.toLowerCase()
            );
            this.saveToLocalStorage();
            this.renderBooks();
            this.renderBorrowHistory();
        }
    }

    renderBooks(booksToRender = this.books) {
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';
        booksToRender.forEach(book => {
            const li = document.createElement('li');
            li.className = 'book-item';
            li.innerHTML = `
                <div>
                    <strong>${book.title}</strong> by ${book.author}
                    <span class="category-tag">${book.category}</span>
                </div>
                <div>
                    ${book.available ? '✅ Available' : '❌ Borrowed'}
                    ${!book.available ? `<button onclick="library.returnBook('${book.title}')">Return</button>` : ''}
                </div>
            `;
            bookList.appendChild(li);
        });
    }

    renderCategories() {
        const categoryList = document.getElementById('categoryList');
        const categories = [...new Set(this.books.map(book => book.category))];
        categoryList.innerHTML = categories.map(category => {
            const categoryBooks = this.books.filter(book => book.category === category);
            return `<p>${category}: ${categoryBooks.length} books</p>`;
        }).join('');
    }

    renderBorrowHistory() {
        const borrowHistory = document.getElementById('borrowHistory');
        borrowHistory.innerHTML = '';
        this.borrowHistory.forEach(record => {
            const li = document.createElement('li');
            li.className = 'borrow-item';
            li.innerHTML = `
                <div>
                    <strong>${record.bookTitle}</strong>
                    <br>Borrowed by ${record.borrowerName}
                </div>
                <div>${record.borrowDate}</div>
            `;
            borrowHistory.appendChild(li);
        });
    }
}

// Initialize library
const library = new BookLibrary();

// Helper functions to connect UI with library methods
function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const category = document.getElementById('bookCategory').value;
    
    if (title && author && category) {
        library.addBook(title, author, category);
        // Clear input fields
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookCategory').value = '';
    } else {
        alert('Please fill in all book details');
    }
}

function searchBooks() {
    const query = document.getElementById('searchInput').value;
    const results = library.searchBooks(query);
    library.renderBooks(results);
}

function lendBook() {
    const bookTitle = document.getElementById('borrowedBookTitle').value;
    const borrowerName = document.getElementById('borrowerName').value;
    
    if (bookTitle && borrowerName) {
        const success = library.lendBook(bookTitle, borrowerName);
        if (!success) {
            alert('Book not found or already borrowed');
        }
        // Clear input fields
        document.getElementById('borrowedBookTitle').value = '';
        document.getElementById('borrowerName').value = '';
    } else {
        alert('Please fill in book title and borrower name');
    }
}
