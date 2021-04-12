const SearchBar = (props) => {


	return (
		<form onSubmit={props.handleSearchSubmit}>
			<input
				placeholder="Paste Tweet URL here..."
				value={props.searchText}
				onChange={props.handleSearchTextChange}
			/>
			<button type="submit">Make Tree!</button>
		</form>
	)
}

export default SearchBar;