import React from 'react';
import { Link, Route } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

import './App.css';
import ShowShelf from './ShowShelf';
import ShowBook from './ShowBook';

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: [],
    query: [],
    search: []
  }

  componentDidMount(){
    this.getBooks()
  }

  getBooks = () => {
    BooksAPI.getAll()
      .then((books)=>{
        let getInfo = books.map((book)=>(
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
          //new book to lib
          if (book.shelf){
            if (value === "none"){
              this.setState( preState =>{
                preState[book.shelf].forEach((item,index)=>{
                  item.id === book.id && preState[book.shelf].splice(index,1);
                })
                return preState;
              })
            } else {
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
            }
          } else {
            if (value !== "none"){
              this.setState(preState=>{
                book.shelf = value;
                preState[value].push(book);
                preState.search && (
                  preState.search.forEach((item,index)=>{
                    item.id === book.id && preState.search.splice(index,1);
                  })
                );
                console.log(`"${book.title}" has be add "${value}" shelf!`)
                return preState;
              })
            }
            }
          }
        )
    )
  }

  getSearch = ( key ) => {
    key.keyCode === 13 && (
      BooksAPI.search(this.state.query)
        .then(books=>{
          let getInfo = books.map((book)=>(
            {
              authors: book.authors,
              title: book.title,
              image: book.imageLinks.thumbnail,
              shelf: book.shelf,
              id: book.id
            }
          ));
          this.setState({ search: getInfo });
        }).catch(rej=>console.log(rej))
    )
  }

  clearSearch = () => {
    this.setState({search:[]})
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
              <Link to="/" className="close-search" onClick={this.clearSearch}>Close</Link>
              <div className="search-books-input-wrapper">
                {/*search terms.*/}
                <input 
                  type="text" 
                  placeholder="Search by title or author" 
                  onChange ={ e=>this.setState({query:e.target.value})}
                  onKeyDown ={ e=>this.getSearch(e)} />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                { this.state.search.length > 0 && (
                  this.state.search.map( item => (
                    <ShowBook
                      key={item.id}
                      book={item} 
                      update={(value,book)=>this.updateStatus(value,book)}/>))
                )}
              </ol>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}


export default BooksApp
