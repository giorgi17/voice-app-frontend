import React, {Component} from 'react';
import './SearchBar.scss';
import axios from 'axios';
import SearchedUser from './SearchedUser/SearchedUser';

class SearchBar extends Component {
    constructor() {
        super();
        this.blackOverlayRef = React.createRef();
        this.searchResultsDisplayRef = React.createRef();
        this.state = {
            searchInput: '',
            searchResult: []
        }
    }

    // When black background is clicked, close everything
    blackOverlayClicked = () => {
        this.blackOverlayRef.current.style.display = 'none';

        // Delay search results dissapearance so it won't miss a click to transfer 
        // to profile page
        setTimeout(() => {
            this.searchResultsDisplayRef.current.style.display = 'none';
        }, 200);
    }

    // On every search input, send request to fetch results
    onSearchInputChange = (e) => {
        const input = e.target.value;
        if (input === ''){
            this.setState({searchResult: []});
            this.searchResultsDisplayRef.current.style.display = 'none';
            return;
        } else {
            this.searchResultsDisplayRef.current.style.display = 'block';
            axios.post("/api/restricted-users/get-user-search-result-data", {searchText: input}).then(response => {
                this.setState({searchResult: response.data.users}); 
            }).catch( err => {
                console.log(err.message);
            });
        }
    }

    on = () => {
        this.blackOverlayRef.current.style.display = "block";
    }
      
    off = () => {
        setTimeout(() => {
            this.blackOverlayRef.current.style.display = "none";
            this.searchResultsDisplayRef.current.style.display = 'none';
        }, 100);
    }

    render() {
        return (
            <React.Fragment>
                <div id="wrap">
                    <input id="search" name="search" 
                        autoComplete="off" type="text"
                        placeholder="What're we looking for ?"
                        onFocus={this.on} onBlur={this.off}
                        onChange={this.onSearchInputChange} /><input id="search_submit" value="Rechercher" type="submit" />
                </div>

                <div id="user-search-results" ref={this.searchResultsDisplayRef}>
                    {this.state.searchResult.map(data => (
                        <SearchedUser user_id={data._id} name={data.name} avatarImage={data.avatarImage}
                            key={data._id} closeSearchPanel={this.blackOverlayClicked}></SearchedUser>
                    ))}
                </div>

                <div id="overlay" ref={this.blackOverlayRef} onClick={this.blackOverlayClicked}>

                </div>
            </React.Fragment>
        );
    }
};

export default SearchBar;