import type { Book } from "../types"

// Data ficticia (tenemos que hacer un Microservicio para los libros)
const MOCK_BOOKS: Book[] = [
  {
    id_libro: 1,
    titulo: "The Great Gatsby",
    autor: "F. Scott Fitzgerald",
    genero: "Classic",
    estado: "disponible",
    descripcion:
      "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
  },
  {
    id_libro: 2,
    titulo: "To Kill a Mockingbird",
    autor: "Harper Lee",
    genero: "Classic",
    estado: "disponible",
    descripcion:
      "The story of young Scout Finch, her brother Jem, and their father Atticus, as they navigate issues of race and class in their small Southern town during the 1930s.",
  },
  {
    id_libro: 3,
    titulo: "The Hobbit",
    autor: "J.R.R. Tolkien",
    genero: "Fantasy",
    estado: "disponible",
    descripcion:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep.",
  },
  {
    id_libro: 4,
    titulo: "Harry Potter and the Sorcerer's Stone",
    autor: "J.K. Rowling",
    genero: "Fantasy",
    estado: "prestado",
    descripcion:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
  },
  {
    id_libro: 5,
    titulo: "Pride and Prejudice",
    autor: "Jane Austen",
    genero: "Romance",
    estado: "disponible",
    descripcion:
      "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
  },
  {
    id_libro: 6,
    titulo: "The Catcher in the Rye",
    autor: "J.D. Salinger",
    genero: "Classic",
    estado: "disponible",
    descripcion:
      'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the "phoniness" of the adult world.',
  },
  {
    id_libro: 7,
    titulo: "The Alchemist",
    autor: "Paulo Coelho",
    genero: "Fiction",
    estado: "disponible",
    descripcion:
      "The Alchemist follows the journey of an Andalusian shepherd boy named Santiago. Believing a recurring dream to be prophetic, he asks a Gypsy fortune teller in the nearby town about its meaning.",
  },
  {
    id_libro: 8,
    titulo: "Brave New World",
    autor: "Aldous Huxley",
    genero: "Science Fiction",
    estado: "prestado",
    descripcion:
      "Largely set in a futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation and classical conditioning.",
  },
]

// Simulate local storage for book data
const books: Book[] = [...MOCK_BOOKS]

export const bookService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    // Simulate API call delay
    //await new Promise((resolve) => setTimeout(resolve, 800))
    return [...books]
  },

  // Get book by ID
  getBookById: async (bookId: string | number): Promise<Book> => {
    // Simulate API call delay
    //await new Promise((resolve) => setTimeout(resolve, 500))

    const book = books.find((b) => b.id_libro === Number.parseInt(bookId.toString()))

    if (!book) {
      throw new Error("Book not found")
    }

    return book
  },

  // Get recently added books (last 4)
  getRecentBooks: async (): Promise<Book[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // In a real app, this would sort by date added
    // Here we'll just return the last 4 books
    return books.slice(-4)
  },

  // Get popular books (most borrowed)
  getPopularBooks: async (): Promise<Book[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // In a real app, this would sort by borrow count
    // Here we'll just return a random selection of 4 books
    return books.sort(() => 0.5 - Math.random()).slice(0, 4)
  },

  // Search books by title, author, or genre
  searchBooks: async (searchTerm: string): Promise<Book[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (!searchTerm) {
      return books
    }

    const term = searchTerm.toLowerCase()
    return books.filter(
      (book) =>
        book.titulo.toLowerCase().includes(term) ||
        book.autor.toLowerCase().includes(term) ||
        book.genero.toLowerCase().includes(term),
    )
  },

  // Update book status (available/borrowed)
  updateBookStatus: async (bookId: string | number, status: "disponible" | "prestado"): Promise<Book> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const bookIndex = books.findIndex((b) => b.id_libro === Number.parseInt(bookId.toString()))

    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    books[bookIndex] = {
      ...books[bookIndex],
      estado: status,
    }

    return books[bookIndex]
  },
}
