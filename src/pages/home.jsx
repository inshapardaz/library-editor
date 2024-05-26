import React from 'react';

// Local imports
import LibrariesList from '/src/components/libraries/list';
import ContentsContainer from '/src/components/layout/contentContainer';

// ------------------------------------------------------------------

const Home = () => {
  return (<>
    <div style={{ marginTop: 50 }} />
    <ContentsContainer>
      <LibrariesList showMore />
    </ContentsContainer>
  </>)
}

export default Home;
