import './App.css';
import SearchBar from './search'
import TreeView from './treeview'
import Title from './title'
import { useState } from 'react'


function App() {
  const [searchText, setSearchText] = useState("");
  const [requestedID, setRequestedID] = useState("0");

  const parseURL = (rawURL) => {
    var parsedID = rawURL;
    const lastQuestion = parsedID.lastIndexOf("?");
    if (lastQuestion >= 0) {
      parsedID = parsedID.slice(0, lastQuestion)
    }
    parsedID = parsedID.slice(parsedID.lastIndexOf("/")+1);
    return parsedID
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setRequestedID(parseURL(searchText));
  }


  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="App">
      <div className="flex-container">
        <Title
          searchRequested={requestedID !== "0"}
        />
        <SearchBar
          searchText={searchText}
          searchRequested={requestedID !== "0"}
          handleSearchTextChange={handleSearchTextChange}
          handleSearchSubmit={handleSearchSubmit}
        />
      </div>
      <TreeView
        requestedID={requestedID}
      />
    </div>
  );
}

export default App;
