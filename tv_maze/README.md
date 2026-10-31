# TV Maze

API tests for the public [TV Maze API](https://www.tvmaze.com/api). The API needs no key, so there is no `.env`. Run the tests from the project root:

```
npx playwright test -c tv_maze
```

## Design decisions

### ID check in the URL

The test searches for "breaking bad", takes the show ID of the first result and requests that show with `GET /shows/{id}`. It then checks that `url` contains `/shows/{id}/`, for example `https://www.tvmaze.com/shows/169/breaking-bad`. Checking for the ID with the surrounding slashes prevents a false pass when the ID only appears as part of a longer number.
