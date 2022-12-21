import React, { useEffect, useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { getAuthors } from 'services/AuthorServices';
import { AuthorDataPopulated } from 'types.ts/AuthorTypes';
import { useNavigate } from 'react-router-dom';

const FilterByAuthor = () => {
  // navigate hook setup
  const navigate = useNavigate();

  // fetch authors
  const [authors, setAuthors] = useState<AuthorDataPopulated[]>([]);

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors();
      setAuthors(response.authors);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // filter by author
  const [filterAuthor, setFilterAuthor] = useState('');

  const handleFilter = () => {
    const author = authors.find((author) => author._id === filterAuthor);
    if (author) navigate('/search', { state: author?.booksWritten });
  };

  useEffect(() => {
    handleFilter();
  }, [filterAuthor]);

  return (
    <FormControl fullWidth>
      <InputLabel>Authors</InputLabel>
      <Select
        label="Authors"
        value={filterAuthor}
        onChange={(event) => {
          setFilterAuthor(event.target.value);
        }}
      >
        {authors &&
          authors.map((author) => {
            const { _id, name } = author;
            return <MenuItem key={_id} value={_id}>{`${name}`}</MenuItem>;
          })}
      </Select>
    </FormControl>
  );
};

export default FilterByAuthor;
