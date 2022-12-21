import React, { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchBooks } from 'services/BookService';
import { BookDataPopulated } from 'types.ts/BookTypes';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  // navigate hook setup
  const navigate = useNavigate();

  // initialise search value and result states
  const [searchValue, setSearchValue] = useState('');

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const response = await searchBooks(searchValue);
      navigate('/search', { state: response.books });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <InputBase
        autoFocus
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by title, or ISBN"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
