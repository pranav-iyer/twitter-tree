const SearchForm = () => {


    return (
        <form action="/tree/" method="get">
            <label htmlFor="main-search">
                <span className='visually-hidden'>Paste Tweet URL here</span>
            </label>
            <input
                type="text"
                id="main-search"
                name="tweet-id"
                placeholder="Paste Tweet URL here..."
            />
            <button type="submit">Make Tree!</button>
        </form>
    )
}

export default SearchForm;