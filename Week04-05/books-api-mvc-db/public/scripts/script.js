async function fetchBooks() {
  try {
    const response = await fetch("/books"); // Replace with your API endpoint
    const data = await response.json();

    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear existing book list

    data.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book"); // Add a CSS class for styling

      // Create elements for title, author, etc. and populate with book data
      const titleElement = document.createElement("h2");
      titleElement.textContent = book.title;

      const authorElement = document.createElement("p");
      authorElement.textContent = `By: ${book.author}`;

      // ... add more elements for other book data (optional)
      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        event.stopPropagation(); // Prevent click event from propagating to parent elements
        deleteBook(book.id); // Call deleteBook function on button click
      });

      // Create edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        event.stopPropagation(); // Prevent click event from propagating to parent elements
        enableEdit(bookItem, book, titleElement, authorElement, editButton, deleteButton); // Call enableEdit function on button click
      });

        // Add event listener to show book details on click
        bookItem.addEventListener("click", () => {
            // Check if the edit button is visible
            if (editButton.style.display !== "none") {
                displayBookDetails(book);
            }
        });

      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      // ... append other elements
      bookItem.appendChild(deleteButton); // Append delete button
      bookItem.appendChild(editButton); // Append edit button

      bookList.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

async function addBook(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const form = event.target;
  const formData = new FormData(form);

  const newBook = {
    title: formData.get("title"),
    author: formData.get("author"),
    // Add more fields if needed
  };

  try {
    const response = await fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (response.ok) {
      await fetchBooks(); // Reload the book list after adding a new book
      form.reset(); // Clear the form fields
    } else {
      console.error("Failed to add book:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

document.getElementById("add-book-form").addEventListener("submit", addBook);

async function deleteBook(bookId) {
  try {
    const response = await fetch(`/books/${bookId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchBooks(); // Reload the book list after deleting the book
    } else {
      console.error("Failed to delete book:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}

async function updateBook(bookId, updatedBookData) {
    try {
        const response = await fetch(`/books/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedBookData)
        });

        if (response.ok) {
            fetchBooks(); // Refresh the book list after updating the book
        } else {
            console.error("Failed to update book:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating book:", error);
    }
}

function enableEdit(bookItem, book, titleElement, authorElement, editButton, deleteButton) {
    // Hide edit button
    editButton.style.display = "none";

    // Hide delete button
    deleteButton.style.display = "none";

    // Create input fields for title and author
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = book.title;
    titleInput.placeholder = "Enter Title";

    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.value = book.author;
    authorInput.placeholder = "Enter Author";

    // Create labels for input fields
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    const authorLabel = document.createElement("label");
    authorLabel.textContent = "Author:";

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        updateBook(book.id, {
            title: titleInput.value,
            author: authorInput.value
        });
    });

    // Prevent popup when clicking on the text fields
    titleInput.addEventListener("click", (event) => event.stopPropagation());
    authorInput.addEventListener("click", (event) => event.stopPropagation());
    saveButton.addEventListener("click", (event) => event.stopPropagation());

    // Replace title and author elements with input fields and labels
    titleElement.replaceWith(titleLabel, titleInput);
    authorElement.replaceWith(authorLabel, authorInput);
    editButton.replaceWith(saveButton);
}

function displayBookDetails(book) {
    // Display book details in an alert (you can customize this as needed)
    alert(`Book Title: ${book.title}\nAuthor: ${book.author}`);
}

// Fetch and refresh the book list every 5 seconds (dynamic refresh)
// setInterval(fetchBooks, 5000);

fetchBooks(); // Call the function to fetch and display book data
