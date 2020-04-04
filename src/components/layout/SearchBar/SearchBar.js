import React from 'react';

import './SearchBar.scss';

const SearchBar = () => {

    const inputRef = React.createRef();

    function on() {
        inputRef.current.style.display = "block";
    }
      
    function off() {
        inputRef.current.style.display = "none";
    }

    return (
        <React.Fragment>
            <div id="wrap">
                <input id="search" name="search" type="text" placeholder="What're we looking for ?" onFocus={on} onBlur={off} /><input id="search_submit" value="Rechercher" type="submit" />
            </div>
            <div id="overlay" ref={inputRef}></div>
        </React.Fragment>
    );
};

export default SearchBar;