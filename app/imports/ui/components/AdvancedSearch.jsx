import React from 'react';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      overflow: 'hidden',
      tags: [],
      type: [],
      sort: 'relevance',
      order: 'descending',
    };

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleOrderChange = this.handleOrderChange.bind(this);

    this.cssTimeout = undefined;
    this.ref = null;
    this.typeRef = null;
    this.sortRef = null;

    this.tagOptions = [];
    for (let i = 0; i < this.props.tags.length; i++) {
      const value = this.props.tags[i].name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      this.tagOptions.push({ key: value, text: this.props.tags[i].name, value: value });
    }
    this.typeOptions = [];
    const typeValues = [];
    for (let i = 0; i < this.props.types.length; i++) {
      const value = this.props.types[i].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (typeValues.indexOf(value) === -1) {
        typeValues.push(value);
        this.typeOptions.push({ key: value, text: this.props.types[i], value: this.props.types[i] });
      }
    }
    this.sortOptions = [
        { text: 'Relevance', value: 'relevance' },
        { text: 'Alphabetical', value: 'alphabetical' },
        { text: 'Date Created', value: 'date created' },
    ];
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.types !== nextProps.types) {
      this.typeOptions = [];
      for (let i = 0; i < this.props.types.length; i++) {
        const value = this.props.types[i].toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.tagOptions.push({ key: value, text: this.props.types[i], value: this.props.types[i] });
      }

      return true;
    }
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
    if (this.state.order !== nextState.order) {
      return true;
    }

    return false;
  }

  handleTagsChange(event, { value }) {
    this.setState({ tags: value }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.order);
    });
  }

  handleTypeChange(event, { value }) {
    this.setState({ type: value }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.order);
    });
  }

  handleSortChange(event, { value }) {
    this.setState({ sort: value }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.order);
    });
  }

  handleOrderChange(event) {
    this.setState({ order: this.state.order === 'descending' ? 'ascending' : 'descending' }, () => {
      this.props.setFilter(this.state.tags, this.state.type, this.state.sort, this.state.order);
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
            <div style={labelStyle}>Tags</div>
            <Dropdown placeholder='Tags' fluid multiple search selection noResultsMessage="No tags found."
                      options={this.tagOptions} onChange={this.handleTagsChange} />
            <div style={labelStyle}>Type</div>
            <Dropdown placeholder="Type" fluid multiple search selection noResultsMessage="No types found."
                      options={this.typeOptions} onChange={this.handleTypeChange} />
            <div style={labelStyle}>Order By</div>
            <Dropdown placeholder="Sort" fluid selection
                      options={this.sortOptions} defaultValue="relevance" onChange={this.handleSortChange}
                      style={{ display: 'inline-block', width: 'calc(100% - 100px)', height: '38px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}/>
            <Button className="sort-order" icon labelPosition="right" onClick={this.handleOrderChange}
                    style={{ width: '100px', height: '38px', margin: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
              {this.state.order === 'descending' ? 'Desc' : 'Asc'}
              <Icon name={this.state.order === 'descending' ? 'arrow down' : 'arrow up'} />
            </Button>
          </div>
        </div>
    );
  }
}

AdvancedSearch.propTypes = {
  tags: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  setFilter: PropTypes.func.isRequired,
  shown: PropTypes.bool.isRequired,
};

export default AdvancedSearch;
