import React, { Component } from 'react';
import { Button, Slider } from '@material-ui/core';
import './styling/MainPage.css';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import Styles from './components/Styles';
import BubbleSort from './algorithms/BubbleSort.js';
import InsertionSort from './algorithms/InsertionSort.js';
import SelectionSort from './algorithms/SelectionSort.js';
import QuickSort from './algorithms/QuickSort.js';
import BogoSort from './algorithms/BogoSort.js';
import MergeSort from './algorithms/MergeSort.js';
import MainToolbar from './components/MainToolbar';

const defaultDatasetSize = 50;
const defaultSortSpeed = 200;
const maxSortSize = 200;
const maxSortSpeed = 200;
const highlightColors = ['red', 'purple', 'blue', 'gray'];
// const styles = Styles;
const styles = {
  // line: {
  //   height: 40,
  //   marginLeft: 15,
  //   marginRight: 15,
  //   borderRightStyle: 'solid',
  //   borderWidth: 1
  // },
  // menuButton: {
  //   position: 'absolute',
  //   right: 15
  // },
  // title: {
  //   marginLeft: 15
  // },
  button: {
    display: 'inline-block',
    backgroundColor: '#3f51b5',
    color: 'white',
    margin: 10,
    '&:hover': {
      backgroundColor: '#5f71d4',
    }
  }
}


class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      isSelected: [],
      stillSorting: false,
      sideMenuOpen: false,
      sortName: 'Bubble Sort',
      dataset: ''
    };

    this.sortHistory = [];
    this.selectedHistory = [];
    this.sortHistoryIndex = 0;
    this.interval = null;
    this.sortSize = defaultDatasetSize;
    this.sortSpeed = defaultSortSpeed;

    this.props.history.listen((location, action) => {
      this.generateRandomArray();
      // this.generateUserArray();

      let path = location.pathname;

      switch (path) {
        case '/bubble-sort':
          this.setState({sortName: 'Bubble Sort'});
          break;
        case '/insertion-sort':
          this.setState({sortName: 'Insertion Sort'});
          break;
        case '/selection-sort':
          this.setState({sortName: 'Selection Sort'});
          break;
        case '/merge-sort':
          this.setState({sortName: 'Merge Sort'});
          break;
        case '/quick-sort':
          this.setState({sortName: 'Quick Sort'});
          break;
        case '/bogo-sort':
          this.setState({sortName: 'Bogo Sort'});
          break;             
        default:
            this.setState({sortName: 'Bubble Sort'});
      }
    });
  }

  componentDidMount() {
    this.generateRandomArray();
  }

  handleDataset = ({ target }) => {
    console.log(target.value);
    this.setState({ dataset: target.value });
  };

  handleSubmit = () => {
    const { dataset } = this.state;

    console.log(dataset);
    this.generateUserArray(dataset);
  };

  /**
   * 
   * @param {*} dataset 
   */
  generateUserArray(dataset) {
    if (this.interval) {
      clearInterval(this.interval);

      this.interval = null;
      this.setState({ stillSorting: false });
    }

    this.sortHistoryIndex = 0;
    this.sortHistory = [];
    this.highlightHistory = [];

    let array = [];

    /**
     * 
     */
    for (let i = 0; i < dataset.length; i++) {
      array = dataset.split("");
      dataset = dataset.split(/[ ,]+/).join(',');
      array = dataset.split(',');
    }

    console.log(dataset);
    console.log(array);

    /**
     * Shuffle the user array using the Fisher-Yates Shuffle
     * 
     * Implementation of the Fisher-Yates Shuffle: https://stackoverflow.com/a/2450976/8721358
     */
    var currentIndex = array.length, temp, random;

    while (0 !== currentIndex) {
      random = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      
      // And swap it with the current element.
      temp = array[currentIndex];
      array[currentIndex] = array[random];
      array[random] = temp;
    }

    this.setState({array: array, isHighlighted: -1});
  }

  generateRandomArray() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;

      this.setState({stillSorting: false});
    }

    this.sortHistoryIndex = 0;
    this.sortHistory = [];
    this.selectedHistory = [];

    let array = [];

    for (let i = 0; i < this.sortSize; i++) {
      array.push(Math.floor( Math.random() * 50) + 1);
    }

    this.setState({array: array, isSelected: -1});
  }

  sortSelected(array, sortHistory, selectedHistory) {
    let path = this.props.location.pathname;

    switch (path) {
      case '/bubble-sort':
        BubbleSort.bubbleSort(array.slice(), sortHistory, selectedHistory);
        break;
      case '/insertion-sort':
        InsertionSort.insertionSort(array.slice(), sortHistory, selectedHistory);
        break;
      case '/selection-sort':
        SelectionSort.selectionSort(array.slice(), sortHistory, selectedHistory);
        break;
      case '/merge-sort':
        MergeSort.mergeSort(array.slice(), sortHistory, selectedHistory);
        break;
      case '/quick-sort':
        QuickSort.quickSort(array.slice(), sortHistory, selectedHistory);
        break;
      case '/bubble-sort':
        BogoSort.bogosort(array.slice(), sortHistory, selectedHistory);
        break;             
      default:
        BubbleSort.bubbleSort(array.slice(), sortHistory, selectedHistory);
    }
  }

  handleSort() {
    if (this.interval) {
      return;
    }

    if (this.sortHistory.length !== 0 && this.sortHistoryIndex === this.sortHistory.length) {
      return;
    }

    if (this.sortHistoryIndex === 0) {
      this.sortSelected(this.state.array.slice(), this.sortHistory, this.selectedHistory);

      this.sortHistoryIndex = 0;

      if (this.sortHistory.length === 1) {
        return;
      }
    }  

    this.setState({stillSorting: true});

    if (this.interval) {
      clearInterval(this.interval);
    }
    
    this.interval = setInterval( () => {
      if (this.sortHistoryIndex >= this.sortHistory.length - 1) {
        clearInterval(this.interval);
        this.interval = null;

        this.setState({stillSorting: false});
      }

      this.setState({
        array: this.sortHistory[this.sortHistoryIndex], 
        isSelected: this.selectedHistory[this.sortHistoryIndex]
      });

      this.sortHistoryIndex++;
    }, maxSortSpeed - this.sortSpeed);
  }

  stopSort() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;

      this.setState({stillSorting: false});
    }
  }

  handleSizeSlide(event, newValue) {
    let array = this.state.array;

    this.sortHistoryIndex = 0;
    this.sortHistory = [];
    this.selectedHistory = [];

    if (newValue > array.length) {
      for (let i = 0; i < newValue - array.length; i++) {
        array.push(Math.floor( Math.random() * 50) + 1);
      }
    } else {
      for (let i = 0; i < array.length - newValue; i++) {
        array.pop();
      }
    }

    this.sortSize = newValue;
    this.setState({array: array});
  }

  handleSpeedSlide(event, newValue) {
    this.sortSpeed = newValue;
  }

  handleHistorySlide(event, newValue) {
    if (newValue < 0 || newValue > this.sortHistory.length - 1) {
      return;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;

      this.setState({stillSorting: false});
    }

    this.setState({
      array: this.sortHistory[newValue], isSelected: this.selectedHistory[newValue]
    });

    this.sortHistoryIndex = newValue;
  }

  determineBarColor(isSelected, index) {
    for (let i = 0; i < isSelected.length; i++) {
      if (isSelected[i] === index) {
        return highlightColors[i];
      }
    }

    // Document
    return 'aqua';
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="App">
        <MainToolbar history={this.props.history} />

        <span className="sort-name"> {this.state.sortName}</span>

        <div className="bar-wrapper">
          {this.state.array.map((item, index) => <Bar key={index} size={item} color={this.determineBarColor(this.state.isSelected, index)}/>)}
        </div>

        <div className="buttons-wrapper">
          <Button className={classes.button} onClick={ () => this.generateRandomArray()}>Generate random array</Button>
          <Button className={classes.button} style={{backgroundColor: this.state.stillSorting ? 'red' : classes.button.backgroundColor}} onClick={ this.state.stillSorting ? this.stopSort.bind(this) : this.handleSort.bind(this)} > {this.state.stillSorting ? 'Stop Sorting' : 'Start Sorting'}</Button>
          <div className="clearfix">
            <div className="buttons-wrapper">
              <Button className={classes.button} onClick={ this.handleSubmit }>Add to own dataset</Button>
              <TextField
              variant="outlined"
              margin="normal"
              id="dataset"
              label="Dataset"
              name="dataset"
              color="white"
              onChange={this.handleDataset} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function Bar(props) {
  // props.color = 'aqua';

  const barStyling = {
    bar: {
      color: 'green',
      display: 'inline-block',
      width: 20,
      margin: 3,
      height: props.size * 8, 
      backgroundColor: props.color
    }
  }

  return (
    // <div className='bar' style={{height: props.size * 8, backgroundColor: props.color, styles.bar}}>
    <div className='bar' style={barStyling.bar}>
    </div>
  );
}

export default withStyles(styles)(MainPage);