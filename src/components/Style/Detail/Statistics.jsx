import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color;
};

function translateY(value) {
  return `translateY(${value}px)`;
}

function Statistics(props) {
  const [dataQueue, setDataQueue] = useState([]);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [highestValue, setHighestValue] = useState(0);
  const [currentValues, setCurrentValues] = useState({});
  const [firstRun, setFirstRun] = useState(false);
  const [afterClick, setAfterClick] = useState(false);
  let iterationTimeoutHolder = null;

  function start() {
    if (activeItemIdx > 1) {
      return;
    }
    if (props.onRunStart) {
      props.onRunStart();
    }
    nextStep(true);
  }

  function setNextValues() {
    if (!dataQueue[activeItemIdx]) {
      iterationTimeoutHolder = null;
      if (props.onRunEnd) {
        props.onRunEnd();
      }
      return;
    }

    const roundData = dataQueue[activeItemIdx].values;
    const nextValues = {};
    let highestValue = 0;
    roundData.map((c) => {
      nextValues[c.id] = {
        ...c,
        color: c.color || (currentValues[c.id] || {}).color || getRandomColor()
      };

      if (Math.abs(c.value) > highestValue) {
        highestValue = Math.abs(c.value);
      }

      return c;
    });

    setCurrentValues(nextValues);
    setHighestValue(highestValue);
    setActiveItemIdx(activeItemIdx + 1);
  }

  function nextStep(firstRun = false) {
    setFirstRun(firstRun);
    setNextValues();
  }

  useEffect(() => {
    setDataQueue(props.data);
  }, []);

  useEffect(() => {
    if (props.startAutomatically) {
      start();
    } else {
      setNextValues();
    }
  }, [dataQueue]);

  useEffect(() => {
    if (props.startAutomatically || afterClick) {
      iterationTimeoutHolder = window.setTimeout(nextStep, firstRun ? props.startRunningTimeout : props.iterationTimeout);
    }

    return () => {
      if (iterationTimeoutHolder) {
        window.clearTimeout(iterationTimeoutHolder);
      }
    };
  }, [activeItemIdx, afterClick]);

  const keys = Object.keys(currentValues);
  const { barGapSize, barHeight, baseline, iterationTimeout, chartWrapperStyles, mainWrapperStyles, iterationTitleStyles, labelStyles, baselineStyles, showTitle } = props;
  const maxValue = highestValue / 0.10;
  const sortedCurrentValues = keys.sort((a, b) => currentValues[b].value - currentValues[a].value);
  const hasBaseline = baseline !== null && !isNaN(baseline);
  const currentItem = dataQueue[activeItemIdx - 1] || {};

  return (
      <div className="live-chart" style={mainWrapperStyles}>
        {
          <div>

            <React.Fragment>
              <section className="chart" style={chartWrapperStyles}>
                <div className={`chart-bars ${hasBaseline ? 'with-baseline' : ''}`} style={{ height: (barHeight + barGapSize)  }}>
                  <div className="row fix-row">
                  {
                    Object.keys(currentValues).length > 0 ?
                    props.sortkey.map((key, idx) => {
                      const currentValueData = currentValues[key];
                      const value = hasBaseline ? (currentValueData.value || baseline) - baseline : currentValueData.value;
                      let width = Math.abs((value / maxValue * 100));
                      let behindbaseline = false;
                      if (hasBaseline && currentValueData.value < baseline) {
                        behindbaseline = true;
                      }

                      if (hasBaseline) {
                        width = width / 2;
                      }

                      let widthStr;
                      if (isNaN(width) || !width) {
                        widthStr = '1px';
                      } else {
                        widthStr = `${width}%`;
                      }
                      const boldText = {
                        fontWeight: 'bold'
                      };
                      return (
                              <div className="col-sm-2">
                                <div className={`bar-wrapper ${behindbaseline ? 'behind-baseline col' : ''}`} style={{ transitionDuration: iterationTimeout / 1000 }} key={`bar_${key}`}>
                                {/*<div className={`bar-wrapper ${behindbaseline ? 'behind-baseline col' : ''}`} style={{ transform: translateY((barHeight + barGapSize) * idx), transitionDuration: iterationTimeout / 1000 }} key={`bar_${key}`}>*/}
                                  <div style={{ 'float': 'left', 'text-transform': 'uppercase', boldText, 'color': '#9a9a9a'}}>
                                    {
                                      !currentValueData.label
                                          ? key
                                          : currentValueData.label
                                    }
                                  </div>
                                  {/*{*/}
                                  {/*  props.checkTotal === false ?*/}
                                  {/*      <span className="bar" style={{ height: barHeight, width: widthStr, background: typeof currentValueData.color === 'string' ? currentValueData.color : `linear-gradient(to right, ${currentValueData.color.join(',')})` }} />*/}
                                  {/*      : ""*/}
                                  {/*}*/}
                                  <div className="value" style={{ color: typeof currentValueData.color === 'string' ? currentValueData.color : currentValueData.color[0] }}>{currentValueData.value}</div>
                                </div>
                          </div>
                      );
                    }):""
                  }
                  </div>
                </div>
              </section>
            </React.Fragment>
          </div>
        }
        {
          props.showStartButton &&
          <button className="start-button" onClick={() => setAfterClick(true)} style={props.startButtonStyles}>{props.startButtonText}</button>
        }
      </div>
  );
}

Statistics.propTypes = {
  startAutomatically: PropTypes.bool,
  showTitle: PropTypes.bool,
  iterationTimeout: PropTypes.number,
  data: PropTypes.array,
  sortkey: PropTypes.array,
  startRunningTimeout: PropTypes.number,
  barHeight: PropTypes.number,
  barGapSize: PropTypes.number,
  baseline: PropTypes.number,
  showStartButton: PropTypes.bool,
  startButtonText: PropTypes.string,
  mainWrapperStyles: PropTypes.object,
  chartWrapperStyles: PropTypes.object,
  baselineStyles: PropTypes.object,
  iterationTitleStyles: PropTypes.object,
  labelStyles: PropTypes.object,
  startButtonStyles: PropTypes.object,
  onRunStart: PropTypes.func,
  onRunEnd: PropTypes.func
};

Statistics.defaultProps = {
  startAutomatically: true,
  showTitle: true,
  iterationTimeout: 200,
  data: [],
  sortkey:[],
  startRunningTimeout: 0,
  barHeight: 20,
  barGapSize: 0,
  baseline: null,
  showStartButton: false,
  startButtonText: 'Start',
  mainWrapperStyles: {},
  chartWrapperStyles: {},
  baselineStyles: {},
  iterationTitleStyles: {},
  labelStyles: {},
  startButtonStyles: {},
  onRunStart: null,
  onRunEnd: null
};

export {
  Statistics
};