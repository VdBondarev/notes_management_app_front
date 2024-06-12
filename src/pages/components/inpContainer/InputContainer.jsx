import React from "react";
import './InputContainer.styles.scss';
import '../styles.scss';

const inputFieldStyle = {
    width: '200px',
    height: '150px',
    resize: 'none'
}

export const InputContainer = ({
    maxTitleLength,
    setTitle,
    maxContentLength,
    setContent,
    handleAddNote,
    title,
    content
}) => (
    <div className="inputContainer">
        <div>
            <label htmlFor="title">Title:</label>
            <textarea
                id="title"
                className="input"
                placeholder={`Title for a new note. \nCannot be empty.\nMaximal length is ${maxTitleLength} symbols`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={ inputFieldStyle }
            />
        </div>
        <div>
            <label htmlFor="content">Content:</label>
            <textarea
                id="content"
                className="input"
                placeholder={`Content for a new note. \nCannot be empty.\nMaximal length is ${maxContentLength} symbols`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={ inputFieldStyle }
            ></textarea>
        </div>
        <button
            className="btn add"
            onClick={handleAddNote}
        >
            Add
        </button>
    </div>
)
