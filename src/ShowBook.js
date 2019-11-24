import React from 'react';

const ShowBook = (props) => (
    <li>
    <div className="book">
        <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${props.book.image}")` }}></div>
        <div className="book-shelf-changer">
            <select 
                onChange={e=>props.update(e.target.value,props.book)}
                defaultValue={props.book.shelf?props.book.shelf:"none"}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">Delete from libary</option>
            </select>
        </div>
        </div>
<div className="book-title">{props.book.title}</div>
<div className="book-authors">{props.book.authors}</div>
    </div>
</li>
);

export default ShowBook;