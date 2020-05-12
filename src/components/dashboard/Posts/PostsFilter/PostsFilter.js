import React from 'react';
import './PostsFilter.css';

const PostsFilter = props => {

    return (
        <div className="posts-filter-container">

            <button className={`posts-filter-btn ${props.isShowAllActive ? "active" : ""}`}
                onClick={() => {props.onClick("showAll"); props.changeFilter('all')}}>Show all</button>

            <button className={`posts-filter-btn ${props.isFollowingActive ? "active" : ""}`}
                onClick={() => {props.onClick("following"); props.changeFilter('following')}}>Following</button>

            <button className={`posts-filter-btn ${props.isMyPostsActive ? "active" : ""}`}
                onClick={() => {props.onClick("myPosts"); props.changeFilter('myPosts')}}>My posts</button>

        </div>
    );
};

export default PostsFilter;