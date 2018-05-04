import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      overflow: 'hidden',
      tags: [],
      type: [],
      sort: 'relevance',
      sortDirection: 'descending',
    };

    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);

    this.cssTimeout = undefined;
    this.ref = null;
    this.typeRef = null;
    this.sortRef = null;

    this.typeOptions = [
      { key: 'academic-professional', text: 'Academic/Professional', value: 'academic-professional' },
      { key: 'leisure-recreational', text: 'Leisure/Recreational', value: 'leisure-recreational' },
      { key: 'ethnic-cultural', text: 'Ethnic/Cultural', value: 'ethnic-cultural' },
    ];
    this.sortOptions = [
        { text: 'Relevance', value: 'relevance' },
        { text: 'Alphabetical', value: 'alphabetical' },
        { text: 'Date Created', value: 'date' },
    ];
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shown !== nextProps.shown) {
      if (this.cssTimeout !== undefined) {
        clearTimeout(this.cssTimeout);
        this.cssTimeout = undefined;
      }

      if (!this.props.shown) {
        this.cssTimeout = setTimeout(() => {
          this.cssTimeout = undefined;
          this.setState({ overflow: 'unset' });
        }, 250);
      } else {
        this.setState({ overflow: 'hidden' });
      }

      return true;
    }
    if (this.state.overflow !== nextState.overflow) {
      return true;
    }

    return false;
  }

  handleTypeChange(event, { value }) {
    this.setState({ type: value }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.sortDirection);
    });
  }

  handleSortChange(event, { value }) {
    this.setState({ sort: value }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.sortDirection);
    });
  }

  render() {
    const style = {
      height: this.props.shown ? this.ref.scrollHeight : 0,
      // paddingTop: '5px',
      background: '#FAFAFA',
      borderBottomRightRadius: '0.28571429rem',
      borderBottomLeftRadius: '0.28571429rem',
      overflowY: this.state.overflow,
      transition: 'height 0.25s',
    };
    const labelStyle = {
      padding: '5px 0',
      textTransform: 'uppercase',
      color: '#999',
      fontSize: '12px',
      fontWeight: 'bold',
    }

    return (
        <div ref={(ref) => { this.ref = ref; }} style={style}>
          <div style={{ padding: '10px' }}>
            <div style={labelStyle}>Filter By</div>
            <div style={labelStyle}>Type</div>
            <Dropdown ref={(ref) => { this.typeRef = ref; }} placeholder="Type" fluid multiple selection
                            options={this.typeOptions} onChange={this.handleTypeChange} />
            <div style={labelStyle}>Sort By</div>
            <Dropdown ref={(ref) => { this.sortRef = ref; }} placeholder="Sort" fluid selection
                            options={this.sortOptions} defaultValue="relevance" onChange={this.handleSortChange} />
          </div>
        </div>
    );
  }
}

/** Require an array of Club documents in the props. */
AdvancedSearch.propTypes = {
  setFilter: PropTypes.func.isRequired,
  shown: PropTypes.bool.isRequired,
};

export default AdvancedSearch;
