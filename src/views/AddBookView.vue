<template>
  <div class="container mt-4" style="max-width: 800px;">
    <h1 class="text-center mb-4">Book Inventory (Firestore)</h1>

    <!-- Add Book Form -->
    <div class="card p-4 mb-4 shadow-sm">
      <h3>Add New Book</h3>
      <form @submit.prevent="addBook">
        <div class="row g-2">
          <div class="col-md-5">
            <input
              type="number"
              class="form-control"
              placeholder="ISBN (e.g. 1234)"
              v-model.number="isbn"
              required
            />
          </div>
          <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              placeholder="Book Name"
              v-model="name"
              required
            />
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-success w-100">Add Book</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Query Operations (where, orderBy, limit) -->
    <div class="card p-4 mb-4 shadow-sm">
      <h3>Filter Books (Task 8.2 Queries)</h3>
      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-outline-primary" @click="fetchBooksWithQuery">
          Query: ISBN > 1000, Order by ISBN, Limit 3
        </button>
        <button class="btn btn-outline-secondary" @click="fetchAllBooks">
          Show All
        </button>
      </div>

      <ul class="list-group">
        <li
          v-for="book in books"
          :key="book.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{{ book.name }}</strong> (ISBN: {{ book.isbn }})
          </div>
          <div class="btn-group">
            <button class="btn btn-sm btn-warning" @click="updateBook(book)">Update Name</button>
            <button class="btn btn-sm btn-danger" @click="deleteBook(book.id)">Delete</button>
          </div>
        </li>
      </ul>
      <p v-if="!books.length" class="text-muted mt-2">No books found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase/init";

const isbn = ref(null);
const name = ref("");
const books = ref([]);

const fetchAllBooks = async () => {
  const querySnapshot = await getDocs(collection(db, "books"));
  books.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// where, orderBy, and limit
const fetchBooksWithQuery = async () => {
  const q = query(
    collection(db, "books"),
    where("isbn", ">", 1000),
    orderBy("isbn", "asc"),
    limit(3)
  );
  const querySnapshot = await getDocs(q);
  books.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add Book
const addBook = async () => {
  if (typeof isbn.value !== "number") return;
  await addDoc(collection(db, "books"), {
    isbn: isbn.value,
    name: name.value
  });
  isbn.value = null;
  name.value = "";
  fetchAllBooks();
};

// Update Book
const updateBook = async (book) => {
  const newName = prompt("Enter updated book name:", book.name);
  if (newName && newName !== book.name) {
    const bookRef = doc(db, "books", book.id);
    await updateDoc(bookRef, { name: newName });
    fetchAllBooks();
  }
};

// Delete Book
const deleteBook = async (id) => {
  if (confirm("Delete this book?")) {
    await deleteDoc(doc(db, "books", id));
    fetchAllBooks();
  }
};

onMounted(() => {
  fetchAllBooks();
});
</script>
