import instance from "./axios.ts";
import type { Review } from "../types"
//NewReviewData

// Mock service for review-related operations
// In a real application, this would make API calls to the Reviews microservice

// Mock reviews data
/*
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    id_libro: 1,
    id_usuario: 2,
    nombre_usuario: "Jane Smith",
    texto:
      "A timeless classic that captures the essence of the Jazz Age. Fitzgerald's prose is beautiful and the characters are unforgettable.",
    calificacion: 5,
    fecha: "2023-03-15T10:30:00Z",
  },
  {
    id: "2",
    id_libro: 1,
    id_usuario: 1,
    nombre_usuario: "John Doe",
    texto:
      "I found the characters to be shallow and the plot somewhat predictable. However, the writing style is undeniably elegant.",
    calificacion: 3,
    fecha: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    id_libro: 3,
    id_usuario: 1,
    nombre_usuario: "John Doe",
    texto:
      "An enchanting adventure that sparked my love for fantasy literature. Tolkien's world-building is unparalleled.",
    calificacion: 5,
    fecha: "2023-04-05T09:15:00Z",
  },
  {
    id: "4",
    id_libro: 5,
    id_usuario: 2,
    nombre_usuario: "Jane Smith",
    texto: "Austen's wit and social commentary are as sharp and relevant today as they were two centuries ago.",
    calificacion: 4,
    fecha: "2023-03-28T16:20:00Z",
  },
]
*/
const MOCK_REVIEWS: Review[] = [
  {
    id_user: 2,
    id_book: 1,
    username: "Jane Smith",
    content:
      "A timeless classic that captures the essence of the Jazz Age. Fitzgerald's prose is beautiful and the characters are unforgettable.",
    rating: 5,
    date: new Date("2023-03-15T10:30:00Z"),
  },
  {
    id_user: 1,
    id_book: 1,
    username: "John Doe",
    content:
      "I found the characters to be shallow and the plot somewhat predictable. However, the writing style is undeniably elegant.",
    rating: 3,
    date: new Date("2023-02-20T14:45:00Z"),
  },
  {
    id_user: 1,
    id_book: 3,
    username: "John Doe",
    content:
      "An enchanting adventure that sparked my love for fantasy literature. Tolkien's world-building is unparalleled.",
    rating: 5,
    date: new Date("2023-04-05T09:15:00Z"),
  },
  {
    id_user: 2,
    id_book: 5,
    username: "Jane Smith",
    content: "Austen's wit and social commentary are as sharp and relevant today as they were two centuries ago.",
    rating: 4,
    date: new Date("2023-03-28T16:20:00Z"),
  },
];

// Simulate local storage for review data
const reviews: Review[] = [...MOCK_REVIEWS]

export const reviewService = {
  // Get reviews for a book
  getBookReviews: async (bookId: string | number): Promise<Review[]> => {
    // Simulate API call delay 
    const response = await instance.get<Review[]>(`/reviews/book/${bookId}`);
    console.log("Response from API:", response);
    const reviews = response.data;
    console.log("Response from API:", response.data);

    //await new Promise((resolve) => setTimeout(resolve, 700))

    return reviews;
    /*
    return reviews
      .filter((review) => review.id_libro === Number.parseInt(bookId.toString()))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Sort by date, newest first
    */

    /*
      .filter((review: { id_libro: number }) => review.id_libro === Number.parseInt(bookId.toString()))
      .sort((a: { fecha: string | number | Date }, b: { fecha: string | number | Date }) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Sort by date, newest first
    */
  },

  // Add a new review
  addReview: async (reviewData: Review): Promise<Review> => {
  //addReview: async (reviewData: NewReviewData): Promise<Review> => {
    // Simulate API call delay
    //await new Promise((resolve) => setTimeout(resolve, 900))

    const newReview: Review = {
      id: Date.now().toString(), // Generate a unique ID
      id_book: Number.parseInt(reviewData.id_book.toString()),
      //id_libro: Number.parseInt(reviewData.id_libro.toString()),
      id_user: reviewData.id_user,
      username: reviewData.username,
      //nombre_usuario: reviewData.nombre_usuario,
      //texto: reviewData.texto,
      content: reviewData.content,
      rating: reviewData.rating,
      //calificacion: reviewData.calificacion,
      date: reviewData.date || new Date().toISOString(),
      //fecha: reviewData.fecha || new Date().toISOString(),
    }
    await instance.post<Review[]>(`/reviews`, newReview);

    //reviews.push(newReview)

    return newReview
  },
/*
  // Get reviews by a user
  getUserReviews: async (userId: number): Promise<Review[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    return reviews
      .filter((review) => review.id_usuario === userId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Sort by date, newest first
  },

  // Update a review
  updateReview: async (reviewId: string, reviewData: Partial<Review>): Promise<Review> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const reviewIndex = reviews.findIndex((review) => review.id === reviewId)

    if (reviewIndex === -1) {
      throw new Error("Review not found")
    }

    // Update review
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...reviewData,
      // Don't allow updating these fields
      id: reviews[reviewIndex].id,
      id_libro: reviews[reviewIndex].id_libro,
      id_usuario: reviews[reviewIndex].id_usuario,
      nombre_usuario: reviews[reviewIndex].nombre_usuario,
    }

    return reviews[reviewIndex]
  },
*/
  // Delete a review
  deleteReview: async (reviewId: string): Promise<{ success: boolean }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    const reviewIndex = reviews.findIndex((review) => review.id === reviewId)

    if (reviewIndex === -1) {
      throw new Error("Review not found")
    }

    // Remove review
    reviews.splice(reviewIndex, 1)

    return { success: true }
  },
}
