import React, { Component } from 'react';
import * as Posts from '../../assets/posts/index.js';
import ReactMarkdown from 'react-markdown/with-html';
import htmlParser from 'react-markdown/plugins/html-parser';

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
  processingInstructions: []
})

class Mobile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='windowContents'>
        <h1 className='title'>Charlie Smart</h1>
        <ReactMarkdown
          escapeHtml={false}
          astPlugins={[parseHtml]}
          source={Posts.About.body}
        />
        <p>Here is a selection of my recent work:</p>
        {
          Object.keys(Posts).reduce((arr, title) => {
            if (title !== 'About' && title !== 'Work') {
              arr.push((
                <div className='mobilePost' key={title}>
                  <h1 className="title">{Posts[title].attributes.title}</h1>
                  <ReactMarkdown
                    escapeHtml={false}
                    astPlugins={[parseHtml]}
                    source={Posts[title].body}
                  />
                </div>
              ));
            }
            return arr;
          }, [])
        }
      </div>
    );
  }
}

export default Mobile;
