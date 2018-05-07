/* global window, document */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Segment, Header, Button, Icon, Form, Card, Loader, Message } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { Tags } from '/imports/api/tags/tags';
import ClubCard from '/imports/ui/components/ClubCard';
import AdvancedSearch from '/imports/ui/components/AdvancedSearch';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** Renders a table containing all of the Club documents. Use <ClubCard> to render each club. */
class ListClubs extends React.Component {

  // https://stackoverflow.com/a/42141641
  // https://stackoverflow.com/a/8876069
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      search: '',
      clubs: [],
      // width: document.documentElement.clientWidth - 80,
      // height: document.documentElement.clientHeight,
      cardWidth: '',
      showAdvanced: false,
      filter: {
        tags: [],
        types: [],
        sort: 'relevance',
        order: 'descending',
      },
    };

    this.clubs = [];
    this.types = [];
    this.searchTimeout = undefined;

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleAdvanced = this.handleAdvanced.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.search = this.search.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.ready !== nextState.ready) {
      return true;
    }
    if (this.state.cardWidth !== nextState.cardWidth) {
      return true;
    }
    if (this.state.showAdvanced !== nextState.showAdvanced) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    let interval;
    interval = setInterval(() => {
      if (this.props.ready) {
        this.clubs = this.search(this.state.search, this.state.filter);

        this.types = [];
        for (let i = 0; i < this.props.clubs.length; i++) {
          if (this.types.indexOf(this.props.clubs[i].type) === -1) {
            this.types.push(this.props.clubs[i].type);
          }
        }
        this.types.sort();

        clearInterval(interval);
        interval = undefined;

        this.setState({ ready: true });
      }
    }, 50);

    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
  }

  componentWillUnmount() {
    if (this.searchTimeout !== undefined) {
      clearTimeout(this.searchTimeout);
    }

    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const CLIENT_WIDTH = document.documentElement.clientWidth - 80;

    const MIN_WIDTH = 300;
    const MARGIN = 7;
    const TOTAL_MARGIN = MARGIN * 2;
    const cardsPerRow = Math.max(Math.floor(CLIENT_WIDTH / (MIN_WIDTH + TOTAL_MARGIN)), 1);
    const cardWidth = `calc(100% / ${cardsPerRow} - ${MARGIN * 2}px)`;

    this.setState({ cardWidth: cardWidth });
  }

  handleAdvanced(event) {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }

  handleFilterChange(tags, types, sort, order) {
    this.setState({ filter: { tags, types, sort, order } }, this.doSearch);
  }

  handleChange(event) {
    this.setState({ search: event.target.value }, this.doSearch);
  }

  doSearch() {
    if (this.searchTimeout !== undefined) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = undefined;
    }

    this.searchTimeout = setTimeout(() => {
      this.searchTimeout = undefined;
      this.clubs = this.search(this.state.search, this.state.filter);
      this.forceUpdate();
    }, 250);
  }

  search(searchTerms, filter) {
    let clubs = this.props.clubs.slice();

    if (filter.tags.length > 0 || filter.types.length > 0) {
      const clubMap = new Map();
      const tagIDs = [];
      const typeIDs = [];
      let filtered;

      for (let i = 0; i < clubs.length; i++) {
        clubMap.set(clubs[i]._id, clubs[i]);
      }

      for (let i = 0; i < filter.tags.length; i++) {
        const tag = this.props.tags.get(filter.tags[i]);
        for (let j = 0; j < tag.clubs.length; j++) {
          if (tagIDs.indexOf(tag.clubs[j]) === -1) {
            tagIDs.push(tag.clubs[j]);
          }
        }
      }

      for (let i = 0; i < clubs.length; i++) {
        if (filter.types.indexOf(clubs[i].type) > -1) {
          typeIDs.push(clubs[i]._id);
        }
      }

      if (tagIDs.length === 0) {
        filtered = typeIDs;
      } else if (typeIDs.length === 0) {
        filtered = tagIDs;
      } else {
        filtered = tagIDs.filter(element => typeIDs.indexOf(element) > -1);
      }

      clubs = [];

      for (let i = 0; i < this.props.clubs.length; i++) {
        if (filtered.indexOf(this.props.clubs[i]._id) > -1) {
          clubs.push(this.props.clubs[i]);
        }
      }
    }

    const termReplacements = [
      // Hawaiian vowels
      [/ā/g, 'a'],
      [/ē/g, 'e'],
      [/ī/g, 'i'],
      [/ō/g, 'o'],
      [/ū/g, 'u'],
      // Miscellaneous
      [/\s+/g, ' '],
      [/[^A-Za-z0-9 ]+/g, ''],
    ];
    const clubReplacements = [
      // Hawaiian vowels
      [/ā/g, 'a'],
      [/ē/g, 'e'],
      [/ī/g, 'i'],
      [/ō/g, 'o'],
      [/ū/g, 'u'],
      // Miscellaneous
      [/[^A-Za-z0-9 ]+/g, ''],
    ];
    const lowRelevanceTerms = ['at', 'in', 'and', 'for', 'the', 'of'];
    const order = this.state.filter.order === 'descending' ? 1 : -1;

    let terms = searchTerms.toLowerCase().trim();

    if (terms === '') {
      clubs.sort((a, b) => (a.name < b.name ? -order : order));

      return clubs;
    }

    for (let i = 0; i < termReplacements.length; i++) {
      terms = terms.replace(termReplacements[i][0], termReplacements[i][1]);
    }
    terms = terms.split(' ');

    let results = [];
    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i];
      let comparisonName = club.name.toLowerCase();
      let comparisonDescription = club.description.toLowerCase();
      const matches = { name: { high: [], low: [] }, description: { high: [], low: [] } };
      // Used to determine how relevant a result is based on the order of the original search terms
      const matchPositions = [];
      let orderScore = 0;

      for (let j = 0; j < clubReplacements.length; j++) {
        comparisonName = comparisonName.replace(clubReplacements[j][0], clubReplacements[j][1]);
        comparisonDescription = comparisonDescription.replace(clubReplacements[j][0], clubReplacements[j][1]);
      }

      for (let j = 0; j < terms.length; j++) {
        if (comparisonName.indexOf(terms[j]) !== -1) {
          if (lowRelevanceTerms.indexOf(terms[j]) !== -1) {
            matches.name.low.push(terms[j]);
          } else {
            matches.name.high.push(terms[j]);
            matchPositions.push(comparisonName.indexOf(terms[j]));
          }
        }

        if (comparisonDescription.indexOf(terms[j]) !== -1) {
          if (lowRelevanceTerms.indexOf(terms[j]) !== -1) {
            matches.description.low.push(terms[j]);
          } else {
            matches.description.high.push(terms[j]);
            matchPositions.push(comparisonDescription.indexOf(terms[j]));
          }
        }
      }

      let previousPosition = matchPositions.length > 0 ? matchPositions[0] : 0;
      for (let j = 1; j < matchPositions.length; j++) {
        if (previousPosition < matchPositions[j]) {
          orderScore++;
          previousPosition = matchPositions[j];
        }
      }

      // const relevance = (matches.length + (lowRelevanceMatches.length / 4)) / terms.length;
      const relevance = ((matches.name.high.length + (matches.name.low.length / 4)) +
          ((matches.description.high.length + (matches.description.low.length / 4)) / 2)) / terms.length;
      if (relevance > 0.35) {
        results.push({ club: club, name: club.name, relevance: relevance, orderScore: orderScore });
      }
    }

    // Remove possible duplicates
    const resultNames = [];
    const uniqueResults = [];
    for (let i = 0; i < results.length; i++) {
      if (resultNames.indexOf(results[i].name) === -1) {
        resultNames.push(results[i].name);
        uniqueResults.push(results[i]);
      }
    }
    results = uniqueResults;

    // Sort results
    results.sort((a, b) => {
      if (this.state.filter.sort === 'relevance') {
        if (a.relevance !== b.relevance) {
          return a.relevance > b.relevance ? -order : order;
        } else
          if (a.orderScore !== b.orderScore) {
            return a.orderScore > b.orderScore ? -order : order;
          }

        return a.name < b.name ? -order : order;
      } else if (this.state.filter.sort === 'alphabetical') {
        return a.name < b.name ? -order : order;
      } else if (this.state.filter.sort === 'date created') {
        return a.created < b.created ? -order : order;
      }

      return a.name < b.name ? -order : order;
    });

    // Extract the clubs
    const clubResults = [];
    for (let i = 0; i < results.length; i++) {
      clubResults.push(results[i].club);
    }

    return clubResults;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.state.ready) ? this.renderPage() : (
        <Container className="content">
          <Segment style={{ height: '100px' }}>
            <Loader active>Loading RIOs</Loader>
          </Segment>
        </Container>
    );
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container fluid className="content rio-list">
          <Header as="h2" textAlign="center" style={{ marginBottom: '4px' }}>{this.state.search === '' ? 'Browse RIOs'
              : `Searching for "${this.state.search}"`}</Header>
          <div style={{ marginBottom: '14px', textAlign: 'center', fontSize: '12px', color: '#AAA' }}>
            {this.state.search === '' ? '' :
                `Ordered by ${this.state.filter.sort} in ${this.state.filter.order} order`}
          </div>

          <Form style={{ height: '45px', margin: '0 4vw' }}>
            <input type="text" placeholder="Search..." onChange={this.handleChange} style={{ width: '87%',
              minWidth: 'calc(100% - 150px)', height: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0,
              borderBottomLeftRadius: this.state.showAdvanced ? 0 : '', fontSize: '15px', lineHeight: '15px' }}/>
            <Button icon labelPosition="right" style={{ width: '13%',
              maxWidth: '150px', height: '100%', margin: 0, borderTopLeftRadius: 0,
              borderBottomRightRadius: this.state.showAdvanced ? 0 : '', borderBottomLeftRadius: 0, fontSize: '12px',
              lineHeight: '12px' }} onClick={this.handleAdvanced}>
              Advanced Search
              <Icon name={this.state.showAdvanced ? 'angle up' : 'angle down'} />
            </Button>
          </Form>
          <div style={{ margin: '0px 4vw 15px' }}>
            <AdvancedSearch tags={this.props.tagArray} types={this.types} setFilter={this.handleFilterChange}
                            shown={this.state.showAdvanced}/>
          </div>

          {Roles.userIsInRole(Meteor.userId(), 'admin') ?
              <Button as={Link} to='/create' basic color="green" className="new-button">
                <Icon name="add" />
                Create New RIO
              </Button>
              : ''}

          {
            this.clubs.length > 0 ?
                <Card.Group style={{ marginTop: '5px' }}>
                  {this.clubs.map((club, index) => <ClubCard key={club._id} club={club}
                                                             width={this.state.cardWidth}/>)}
                </Card.Group>
                :
                <Message>
                  <Message.Header>
                    No Results!
                  </Message.Header>
                  <p>
                    There are no RIOs to show!
                  </p>
                </Message>
          }
        </Container>
    );
  }
}

/** Require an array of Club documents in the props. */
ListClubs.propTypes = {
  clubs: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  tagArray: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Clubs documents.
  const clubSubscription = Meteor.subscribe('Clubs');
  const tagSubscription = Meteor.subscribe('Tags');

  const tagMap = new Map();
  const tags = Tags.find().fetch();

  if (tagSubscription.ready()) {
    for (let i = 0; i < tags.length; i++) {
      tagMap.set(tags[i].name, tags[i]);
    }
  }

  return {
    clubs: Clubs.find(Roles.userIsInRole(Meteor.userId(), 'admin') ? {} : { active: true }).fetch(),
    tags: tagMap,
    tagArray: tags,
    ready: (() => clubSubscription.ready() && tagSubscription.ready())(),
  };
})(ListClubs);
