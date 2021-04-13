const SearchBar = (props) => {

  if (!props.searchRequested) {
  	return (
  		<form onSubmit={props.handleSearchSubmit}>
        <label htmlFor="main-search">
          <span className="visually-hidden">Paste a Tweet URL here</span>
        </label>
  			<input
          id="main-search"
  				placeholder="Paste a Tweet URL here..."
  				value={props.searchText}
  				onChange={props.handleSearchTextChange}
  			/>
  			<button type="submit">Make Tree!</button>
  		</form>
  	)
  } else {
    return <div></div>
  }
}

export default SearchBar;