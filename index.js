const express = require("express");
const { intializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const app = express();
const Book = require("./models/books.models");
intializeDatabase();
app.use(express.json())
const cors = require("cors");

app.use(cors());
async function addBook(bookData){
    try {
        const newBook = new Book(bookData)
        const savedBook = await newBook.save()
        return savedBook;
    } catch (error) {
        throw error
    }
}

app.post("/book",async(req,res)=>{
    try {
        const savedBook = await addBook(req.body)
        res.status(201).json({
            message:"Book added successfully.",
            book:savedBook
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Unable to fetch Data" });
    }
})

async function getAllBooks() {
    try {
       const allBook =await Book.find()
       return allBook 
    } catch (error) {
        throw error
    }
}

app.get("/books",async(req,res)=>{
    try {
        const allBook = await getAllBooks();
        if(allBook.length!==0){
 res.json(allBook)
        }
       else{
                res.status(401).json({ error: "No book found" });
       }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Unable to fetch Data" });
    }
})

async function getBookByTitle(bookTitle){
    try {
      const bookResult =await Book.findOne({title:bookTitle})  
      return bookResult
    } catch (error) {
        throw error;
    }
}
app.get("/books/:bookTitle",async(req,res)=>{
    try {
        const bookRes = await getBookByTitle(req.params.bookTitle)
        if(bookRes){
            res.json(bookRes)
        }
        else{
            res.status(401).json({ error: "No book found" });
        }
        
    } catch (error) {
        console.log(error)
       res.status(500).json({ error: "Unable to fetch Data" }); 
    }
})

async function getBookByAuthor(bookAuthor) {
    try {
    const book =await Book.findOne({author:bookAuthor})
    console.log(book)
    return book;        
    } catch (error) {
        throw error;
    }
}

app.get("/books/author/:authorName",async(req,res)=>{
    try {
        const bookRes = await getBookByAuthor(req.params.authorName)
        console.log(bookRes)
        if(bookRes){
            res.json(bookRes)
        }else{
            res.status(401).json({ error: "No book found" });
        }
        
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch Data" }); 
    }
})

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const genreName = req.params.genreName; 

    const books = await Book.find({ genre: genreName });

    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: `No books found in "${genreName}" genre` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/books/publishedYear/:publishedYear", async (req, res) => {
  try {
    const BookReleaseYear = parseInt(req.params.publishedYear);
    const bookResults = await Book.find({ publishedYear: BookReleaseYear });

    if (bookResults.length > 0) {
      res.json(bookResults);
    } else {
      res.status(404).json({ message: `No books found in ${BookReleaseYear}` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

async function updateBook(bookId,updatedData){
    try {
        const updatedBook =await Book.findByIdAndUpdate(bookId,updatedData,{
            new:true
        })
        return updatedBook;
    } catch (error) {
        throw error;
    }
}

app.post("/books/:bookId",async(req,res)=>{
    try {
        const updatedBookData=await updateBook(req.params.bookId,req.body)
        if(updatedBookData){
            res.status(200).json({message:"Data updated Successfully",updatedBookData:updatedBookData})
        }
         else{
            res.status(404).json({error:"Book Doesn't Exist"})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
})

async function updateBookByTitle(bookTitle,updatedData){
    try {
        const updateRes=await Book.findOneAndUpdate({title:bookTitle},updatedData,{
            new:true
        })
        return updateRes
    } catch (error) {
        throw error;
    }
}

app.post("/books/title/:bookTitle",async(req,res)=>{
    try {
        const updatedBookData = await updateBookByTitle(req.params.bookTitle,req.body)
        if(updatedBookData){
             res.status(200).json({message:"Data updated Successfully",updatedBookData:updatedBookData})
        }  
        else{
            res.status(404).json({error:"Book Doesn't Exist"})
        }
    } catch (error) {
         res.status(500).json({ error: "Failed to fetch books" });
    }
})

app.delete("/books/:bookId",async(req,res)=>{
    try {
        const bookId = req.params.bookId;
        const deletedBook = await Book.findByIdAndDelete(bookId)
        if(deletedBook){
       res.status(200).json({message:"Book deleted successfully."})
        }else{
            res.status(404).json({error:"Book not found"}) 
        }


        
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch books" }); 
    }
})


const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
