import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "../helpers/icons";


import NavigationContainer from "./navigation/navigation-container";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import BlogDetail from "./pages/blog-detail";
import PortfolioManager from "./pages/portfolio-manager";
import PortfolioDetail from "./portfolio/portfolio-detail";
import Auth from "./pages/auth";
import NoMatch from "./pages/no-match";



export default class App extends Component {
  constructor(props) {
    super(props);

    Icons();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN"
    }

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
  }

  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN"
    })
  }

  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  checkLoginStatus() {
    return axios.get("https://api.devcamp.space/logged_in", { 
      withCredentials: true 
    })
    .then(response => {
      const loggedIn = response.data.logged_in;
      const loggedInStatus = this.state.loggedInStatus;
      //below conditionals
      //if loggedIn and status is logged in (then you don't need to do anything) => just return data
      //if logged in(response true) status is not logged in => we need to update state
      //if not logged in(call api not logged in) and status is logged in then => make sure we log out(update state to logged out)
      if (loggedIn && loggedInStatus === "LOGGED_IN") {
        return loggedIn
      } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN") {
        this.setState({
          loggedInStatus: "LOGGED_IN"
        });
      } else if (!loggedIn && loggedInStatus === "LOGGED_IN") {
        this.setState({
          loggedInStatus: "NOT_LOGGED_IN"
        })
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  authorizedPages() {
    return [
      <Route key="portfolio-manager" path="/portfolio-manager" component={PortfolioManager} /> 
    ];
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <div>
            <NavigationContainer 
              loggedInStatus={this.state.loggedInStatus} 
              handleSuccessfulLogout={this.handleSuccessfulLogout}
            />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route 
                path="/auth" 
                render={
                  props => ( 
                    <Auth 
                      {...props} 
                      handleSuccessfulLogin={this.handleSuccessfulLogin} 
                      handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                    />  
                  )}
              />
              <Route path="/about-me" component={About} />
              <Route path="/blog" 
                render={props => (
                  <Blog {...props} loggedInStatus={this.state.loggedInstatus} />
                )}
                />


              <Route path="/b/:slug"
              render={props => (
                <BlogDetail { ...props} loggedInstatus={this.state.loggedInstatus}
                />
              )}
              />

              <Route path="/b/:slug" component={BlogDetail} />

              <Route path="/contact" component={Contact} />
              
              {this.state.loggedInStatus === "LOGGED_IN" ? this.authorizedPages() : null }          
              <Route path="/portfolio/:slug" component={PortfolioDetail} />            
              <Route component={NoMatch} />
            </Switch>
          </div>  
        </Router>
      </div>
    );
  }
}