import React, { Component } from "react";
import './Search.css';
import SearchView from './SearchView/SearchView';

const Search = props => {
    
        return (
            <React.Fragment>
            <div id="responsive-search-container" 
                className={`responsive-menu-item ${props.isSearchActive ? "active" : ""}`}
                onClick={() => {props.onClick(); props.changeDisplayedContent(<SearchView/>);}} >
                <span className={`material-icons search-icon ${props.isSearchActive ? "active" : ""}`} >
                    search
                </span>
            </div>
            </React.Fragment>
        );
    
};

export default Search;