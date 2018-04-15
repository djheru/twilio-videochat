import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { render } from 'react-dom';
import './styles/styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const dom = document.getElementById('app');
const app = (
  <MuiThemeProvider muiTheme={ getMuiTheme(darkBaseTheme) }>
    <div>
      <AppBar title="Twilio Video Chat"/>
    </div>
  </MuiThemeProvider>
);
render(app, dom);
