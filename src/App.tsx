import React from 'react';
import logo from './logo.svg';
import './App.css';
import { generateKeyPair } from 'crypto';

interface IbitlyAPI {
  [key: string]: any
}

class App extends React.Component<IbitlyAPI> {
  constructor(props:any) {
    super(props);
    this.getBitlyShortURL = this.getBitlyShortURL.bind(this);
  } 

  state = {
    generalAccessToken: 'b853531ceca87d5e0a4129cd09bc6b34e93c619f',
    group_guid: null,
    long_url: '',
    short_url: '',
    respond_data: {} as IbitlyAPI
  };

  componentDidMount(){
    this.getBitlyGroup();
  }

  getBitlyGroup(){
    fetch('https://api-ssl.bitly.com/v4/groups', {
      method: 'get',
      headers : {
        'Content-Type': 'application/json',
        'Authorization' : this.state.generalAccessToken
      }
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        group_guid:res.groups[0].guid
      })
    });
  }

  getBitlyShortURL(){
    console.log(this.state);
    let body = {
      'long_url': this.state.long_url,
      'groud_guid': this.state.group_guid
    };

    fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : this.state.generalAccessToken
      },
      body: JSON.stringify(body)})
      .then(res => res.json())
      .then(res => {

        this.setState({
          respond_data: res
        })

      })
  }

  handleInputOnChange = (e:any) => {
    this.setState({
      long_url: e.target.value
    }, () => {
      console.log(this.state.long_url)
    })
  }
  

  render(){

    let { long_url, respond_data } = this.state;
    let link = null;
    
    if(respond_data){
      if(!respond_data.hasOwnProperty('errors'))
        link = <a target="_blank" rel="noopener noreferrer" href={respond_data.link}> {respond_data.link} </a>
      else
        link = <span> {respond_data.description} </span>

    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            URL
          </div>
          <div>
            <input type="text" name="url" value={long_url} onChange={this.handleInputOnChange}/>
          </div>
          <div>
            <input type="submit" value="Submit" onClick={this.getBitlyShortURL}/>
          </div>
          <div>
            {link} 
          </div>
        </header>
      </div>
    );
  }
}

export default App;
