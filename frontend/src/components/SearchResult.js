import React from 'react';

const SearchResult = ({ query, items }) => {
  return (
    <div>
      <h1>{query}</h1>
      <ul>
        {items.map(item => (
          <li key={item.id.videoId}>
            <img src={item.snippet.thumbnails.high.url} alt=""/>
            <h2>{item.snippet.title}</h2>
            <p>{item.snippet.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

SearchResult.propTypes = {
  query: React.PropTypes.string,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.shape({
      kind: React.PropTypes.string,
      videoId: React.PropTypes.string,
    }),
    snippet: React.PropTypes.shape({
      title: React.PropTypes.string,
      description: React.PropTypes.string,
      thumbnails: React.PropTypes.shape({
        high: React.PropTypes.shape({
          url: React.PropTypes.string,
          width: React.PropTypes.number,
          height: React.PropTypes.number,
        }),
      }),
    }),
  })),
};
SearchResult.defaultProps = {
  query: 'No result found',
  items: [],
};

export default SearchResult;