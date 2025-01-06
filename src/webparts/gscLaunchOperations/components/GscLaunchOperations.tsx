import * as React from 'react';
//import styles from './GscLaunchOperations.module.scss';
import { IGscLaunchOperationsProps } from './IGscLaunchOperationsProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { BrowserRouter, Route, HashRouter, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import './GscLaunchOperations.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Home from './Home/Home';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Layout from './Layout/Layout';
import ProductGridTable from './ProductGridTable/ProductGridTable';

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });
export default class GscLaunchOperations extends React.Component<IGscLaunchOperationsProps, {}> {
  private currentUser;
  private userGroups = [];
  public headerText = '';

  constructor(public props: IGscLaunchOperationsProps, public state: any) {
    super(props);
    this.state = {
      redirectAfterDidUpdate: false,
      headerText: ''
    };
    this.userGroups = this.props.userGroups;
    this.currentUser = this.props.currentUser;
    this.updateHeaderText = this.updateHeaderText.bind(this);
  }
  public componentWillMount() {
    //fetching all site groups
    if (window.location.href.indexOf('Test') || window.location.href.indexOf('test')) {
      this.updateHeaderText('Launch Operations - Demo');
    } else if (window.location.href.indexOf('qa') || window.location.href.indexOf('QA')) {
      this.updateHeaderText('Launch Operations - DEMO');
    } else {
      this.updateHeaderText('Launch Operations');
    }

    this.setState({
      redirectAfterDidUpdate: true
    });
  }
  public updateHeaderText(text: string) {
    // console.log('updateheaderText : ', text);
    this.setState({ headerText: text });
    // this.headerText=text;
  }
  public render(): React.ReactElement<IGscLaunchOperationsProps> {
    return (
      <React.Fragment >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="wrapper dx-viewport">
              <div style={{ background: 'white' }} >
                <main className="content">
                  <HashRouter basename="/" >
                    <Header {...this.props} headerText={this.state.headerText}></Header>
                    <Layout  {...this.props}></Layout>
                    <Switch>
                      <Redirect exact from="/" to="/Home" />
                      <Route path="/Home" render={(props) =>
                        <Home
                          siteUrl={this.props.siteUrl}
                          context={this.props.context}
                          currentUser={this.currentUser}
                          userGroups={this.userGroups}
                          headerText={this.updateHeaderText}
                          {...props}
                        />
                      }
                      />
                      <Route path="/Product" render={(props) =>
                        <ProductGridTable
                          siteUrl={this.props.siteUrl}
                          context={this.props.context}
                          currentUser={this.currentUser}
                          userGroups={this.userGroups}
                          headerText={this.updateHeaderText}
                          {...props}
                        />} />
                    </Switch>
                    <Footer siteUrl={this.props.siteUrl} />
                  </HashRouter>
                </main>
              </div>
            </div>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </React.Fragment >
    );
  }
}
