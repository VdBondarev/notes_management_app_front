import React from "react";
import './InpContainer.styles.scss';

export const InpContainer = ({
    maxTitleLength,
    setTitle,
    maxContentLength,
    setContent,
    handleAddNote,
    title,
    content
}) => (
    <div className="inpContainer">
        <div>
            <label htmlFor="title">Title:</label>
            <textarea
                id="title"
                className="input"
                placeholder={`Cannot be empty.\nMaximal length is ${maxTitleLength} symbols`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{width: '200px', height: '150px', resize: 'none'}}
            />
        </div>
        <div>
            <label htmlFor="content">Content:</label>
            <textarea
                id="content"
                className="input"
                placeholder={`Cannot be empty.\nMaximal length is ${maxContentLength} symbols`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{width: '200px', height: '150px', resize: 'none'}}
            ></textarea>
        </div>
        <button className="btn add" onClick={handleAddNote} style={{height: '80px', fontSize: '15px'}}>
            Add a note
        </button>
    </div>
)
