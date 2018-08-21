import React from 'react';
import api from './api';
import './style.css';

export default class App extends React.Component {
  state = {
    sentence: {
      md5: '_',
      sentence: '',
    },
  }

  componentDidMount = async () => {
    this.rand();
  }

  render() {
    const sentence = this.state.sentence;
    const text = sentence.sentence;
    const lines = text.split('\n').filter(line => line.length);
    const content = lines.map((line, i) => {
      if (line.trim().startsWith('--')) {
        return <p className="ref" key={i}>{line}</p>;
      }
      return <p key={i}>{line}</p>;
    });
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'strech',
          height: '100%',
          boxSizing: 'border-box',
          padding: '1em',
        }}
      >
        <div>
          {content}
        </div>
        <div>
          <textarea className="edit" ref={ref => this.edit = ref}/>
          <div className="button-group">
            <button onClick={this.new}>New</button>
            <button onClick={this.rand}>Random</button>
          </div>
        </div>
      </div>
    );
  }

  new = async () => {
    const text = this.edit.value;
    if (text.length === 0) return;
    if (text === 'd') {
      await api.get('/api/delete/' + this.state.sentence.md5);
      await this.rand();
      return;
    }
    const sentence = await api.post('/api/new', {text: text});
    if (sentence) {
      this.setState({sentence: sentence});
    }
  }

  rand = async () => {
    const sentence = await api.get('/api/rand/' + this.state.sentence.md5);
    if (sentence) {
      console.log(sentence);
      this.setState({sentence: sentence});
    }
  }
}
