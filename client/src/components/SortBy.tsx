import React, { useEffect, useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { getSortedBooks } from 'services/BookService';
import { useNavigate } from 'react-router-dom';

const SortBy = () => {
  // navigate hook setup
  const navigate = useNavigate();

  // initialise sort by state
  const [sortBy, setSortBy] = useState('');

  // fetch sorted books
  const fetchSortedBooks = async () => {
    try {
      const sortParams = sortBy.split('-');
      const response = await getSortedBooks(
        sortParams[0],
        sortParams[1] === 'ascending' ? 1 : -1
      );
      navigate('/search', { state: response.sortedBooks });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sortBy.length && fetchSortedBooks();
  }, [sortBy]);

  return (
    <FormControl fullWidth>
      <InputLabel>Sort By</InputLabel>
      <Select
        label="Authors"
        value={sortBy}
        onChange={(event) => {
          setSortBy(event.target.value);
        }}
      >
        <MenuItem value="title-ascending">Title A-Z</MenuItem>
        <MenuItem value="title-descending">Title Z-A</MenuItem>;
        <MenuItem value="publishedYear-ascending">
          Published (ascending)
        </MenuItem>
        ;
        <MenuItem value="publishedYear-descending">
          Published (descending)
        </MenuItem>
        ;
      </Select>
    </FormControl>
  );
};

export default SortBy;
