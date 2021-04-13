const SearchBar = (props) => {

  if (props.toDisplay) {
  	return (
  		<form
        onSubmit={props.handleSearchSubmit}
        className="flex-container"
      >
        <label htmlFor="main-search">
          <span className="visually-hidden">Paste a Tweet URL here</span>
        </label>
  			<input
          id="main-search"
  				placeholder="Paste Tweet URL here..."
  				value={props.searchText}
  				onChange={props.handleSearchTextChange}
  			/>
  			<button
          type="submit"
          disabled={props.buttonDisabled}
        >
          {!props.buttonDisabled && "Make Tree"}
          {props.buttonDisabled && "Making Tree..."}
        </button>
  		</form>
  	)
  } else {
    return <div></div>
  }
}

export default SearchBar;