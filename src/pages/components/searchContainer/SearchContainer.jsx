import React from "react";
import '../styles.scss';

const inputFieldStyle = {
    width: '550px',
    height: '30px',
    resize: 'none'
}

export const SearchContainer = ({
    searchTitle,
    setSearchTitle,
    setPage,
    searchContent,
    setSearchContent }) => (
    <div className="search-container">
        <div>
            <label htmlFor="searchTitle">Title:</label>
            <textarea
                id="searchTitle"
                className="input"
                placeholder="Search for notes by title"
                value={searchTitle}
                onChange={(e) => {
                    setSearchTitle(e.target.value);
                    setPage(0);
                }
                }
                style={ inputFieldStyle }
            />
        </div>
        <div>
            <label htmlFor="searchContent">Content:</label>
            <textarea
                id="searchContent"
                className="input"
                placeholder="Search for notes by content"
                value={searchContent}
                onChange={(e) => {
                    setSearchContent(e.target.value);
                    setPage(0);
                }
                }
                style={ inputFieldStyle }
            />
        </div>
    </div>
)
