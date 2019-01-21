import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchTerm:''
    }
    this.search=this.search.bind(this);
    this.handleNameChange=this.handleNameChange.bind(this);
  }


search() {
  this.props.onSearch(this.state.searchTerm);
}

handleNameChange(event) {
  this.setState({searchTerm:event.target.value});
}

render() {
   return (
     <div className="SearchBar">
       <input placeholder="Enter A Song, Album, or Artist"
         onChange={this.handleNameChange} />
       <a onClick={this.search}>SEARCH</a>
     </div>
   );
  }

}

export default SearchBar;
