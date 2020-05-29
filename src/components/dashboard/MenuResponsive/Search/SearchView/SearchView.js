import React, { Component } from 'react';
import './SearchView.css';
import TextField from '@material-ui/core/TextField';
import MenuResponsive from '../../Menu';
import axios from 'axios';
import SearchedUser from '../../../../layout/SearchBar/SearchedUser/SearchedUser';

class SearchView extends Component {
    constructor() {
        super();
        this.searchResultsDisplayRef = React.createRef();
        this.state = {
            searchInput: '',
            searchResult: []
        }
    }

    // On every search input, send request to fetch results
    onSearchInputChange = (e) => {
        const input = e.target.value;
        if (input === ''){
            this.setState({searchResult: []});
            return;
        } else {
            axios.post("/api/restricted-users/get-user-search-result-data", {searchText: input}).then(response => {
                this.setState({searchResult: response.data.users}); 
            }).catch( err => {
                console.log(err.message);
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <MenuResponsive history={{...this.props.history}} menuName="search" />
                <div className="responsive-search-view-container">
                    <div className="responsive-search-view-top">
                        <div className="responsive-search-view-top-search-input">
                            <TextField id="outlined-basic" label="Search" variant="outlined"
                                onChange={this.onSearchInputChange} />
                        </div>
                        <span className="material-icons responsive-search-view-search-icon">
                            search
                        </span>
                    </div>

                    <div className="responsive-search-view-search-results" ref={this.searchResultsDisplayRef}>
                        {this.state.searchResult.map(data => (
                                <SearchedUser user_id={data._id} name={data.name} avatarImage={data.avatarImage}
                                    key={data._id} closeSearchPanel={this.blackOverlayClicked}></SearchedUser>
                            ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SearchView;