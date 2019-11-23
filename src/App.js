import React from 'react';
import { Link, Route } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

import './App.css';
import ShowShelf from './ShowShelf';

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  componentDidMount(){
    this.getBooks()
  }

  getBooks = () => {
    BooksAPI.getAll()
      .then((books)=>{
        const getInfo = books.map((book)=>(
          {
            authors: book.authors,
            title: book.title,
            image: book.imageLinks.thumbnail,
            shelf: book.shelf,
            id: book.id
          }
        ));
        this.setState({
          currentlyReading:getInfo.filter(item=>item.shelf==="currentlyReading"),
          wantToRead:getInfo.filter(item=>item.shelf==="wantToRead"),
          read:getInfo.filter(item=>item.shelf==="read")
        });
      })
  }

  updateStatus = (value,book) =>{
    book.shelf !== value && (
      BooksAPI.update(book,value)
        .then(res=>{
          this.setState( preState => {
            let index;
            preState[book.shelf].forEach((v,i)=>{
              v.id === book.id && (index = i);
            });
            preState[book.shelf].splice(index,1);
            book.shelf = value;
            preState[value].push(book);
            return preState
          })
        })
    )
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={()=>(
            <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <ShowShelf 
                  title="Currently Reading" 
                  books={this.state.currentlyReading} 
                  update={(value,book)=>this.updateStatus(value,book)} />
                <ShowShelf 
                  title="Want to Read" 
                  books={this.state.wantToRead} 
                  update={(value,book)=>this.updateStatus(value,book)} />
                <ShowShelf 
                  title="Read" 
                  books={this.state.read} 
                  update={(value,book)=>this.updateStatus(value,book)} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" className="open-button">Add a book</Link>
            </div>
          </div>
        )} />
        <Route path="/search" render={ ()=>(
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search">Close</Link>          
              <div className="search-books-input-wrapper">
                {/*search terms.*/}
                <input type="text" placeholder="Search by title or author"/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}


export default BooksApp
