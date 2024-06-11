import React from "react";
import './SearchContainer.styles.scss';

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
                placeholder="Title"
                value={searchTitle}
                onChange={(e) => {
                    setSearchTitle(e.target.value);
                    setPage(0);
                }
                }
                style={{width: '150px', height: '30px', resize: 'none'}}
            />
        </div>
        <div>
            <label htmlFor="searchContent">Content:</label>
            <textarea
                id="searchContent"
                className="input"
                placeholder="Content"
                value={searchContent}
                onChange={(e) => {
                    setSearchContent(e.target.value);
                    setPage(0);
                }
                }
                style={{width: '150px', height: '30px', resize: 'none'}}
            />
        </div>
    </div>
)