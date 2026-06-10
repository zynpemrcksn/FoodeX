function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>

      <input
        type="text"
        placeholder="Search restaurants or products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  )
}

export default SearchBar