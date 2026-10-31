// Show object of the TV Maze API, see https://www.tvmaze.com/api#show-main-information
export interface Show {
  id: number;
  url: string;
}

// Item of the response of GET /search/shows, see https://www.tvmaze.com/api#show-search
export interface ShowSearchResult {
  show: Show;
}
