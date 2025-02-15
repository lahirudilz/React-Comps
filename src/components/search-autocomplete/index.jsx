import { useEffect, useState } from "react";
import Suggestions from "./suggestions";

export default function SearchAutocomplete() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchParam, setSearchParam] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  function handleChange(event) {
    const query = event.target.value.toLowerCase();
    setSearchParam(query);
    if (query.length > 1) {
      const filterData =
        users && users.length
          ? users.filter((item) => item.toLowerCase().indexOf(query) > -1)
          : [];

      setFilteredUsers(filterData);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }

  function handleClick(event) {
    setShowDropdown(false);
    setSearchParam(event.target.innerText);
    setFilteredUsers([]);
  }

  async function fetchListOfUsers() {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/users");
      const data = await response.json();

      if (data && data.users && data.users.length) {
        setUsers(data.users.map((dataItem) => dataItem.firstName));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      setError(error);
    }
  }

  useEffect(() => {
    fetchListOfUsers();
  }, []);

  console.log(users, filteredUsers);

  if (loading) {
    return <div>Loading data! Please wait...</div>;
  }

  if (error !== null) {
    return <div>Error Occurred! error.message</div>;
  }

  return (
    <div className="search-autocomplete-container">
      <input
        value={searchParam}
        name="search-users"
        placeholder="Serach Users here..."
        onChange={handleChange}
      />
      {showDropdown ? (
        <Suggestions data={filteredUsers} handleClick={handleClick} />
      ) : null}
    </div>
  );
}
