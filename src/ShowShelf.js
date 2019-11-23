import React from 'react';

import ShowBook from './ShowBook';

const ShowShelf = (props) => { 
return(
    <div className="bookshelf">
        <h2 className="bookshelf-title">{props.title}</h2>
        <div className="bookshelf-books">
            <ol className="books-grid">
                {props.books && props.books.map( 
                    book=><ShowBook key={book.title} book={book} update={(value,book)=>props.update(value,book)}/>)}
            </ol>
        </div>
    </div>
)
}

export default ShowShelf;