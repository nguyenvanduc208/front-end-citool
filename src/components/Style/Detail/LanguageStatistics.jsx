import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Statistics} from "./Statistics";
import Card from "../../Card/Card";

export default function LanguageStatistics(props) {
  const { data} = props;
  let totalLow = 0;
  let totaHeight = 0;
  let totalMedium = 0;
  let totalCritical = 0;
  let to = [
    {
      "name": "Round 1",
      "values": [
        {
          "id": 4,
          "label": "Low",
          "value": 0,
          "color": "black"
        },
        {
          "id": 3,
          "label": "Medium",
          "value": 0,
          "color": ["green", "green"]
        },
        {
          "id": 2,
          "label": "High",
          "value": 0,
          "color": ["orange","orange"]
        },{
          "id": 1,
          "label": "Critical",
          "value": 0,
          "color": ["red","red"]
        }
      ]
    },
    {
      "name": "Round 2",
      "values": [
        {
          "id": 4,
          "label": "Low",
          "value": 0,
          "color": "black"
        },
        {
          "id": 3,
          "label": "Medium",
          "value": 0,
          "color": ["green"]
        },
        {
          "id": 2,
          "label": "High",
          "value": 0,
          "color": ["orange"]
        },
        {
          "id": 1,
          "label": "Critical",
          "value": 0,
          "color": ["red","red"]
        }
      ]
    },
    {
      "name": "Round 3",
      "values": [
        {
          "id": 4,
          "label": "Low",
          "value": 654,
          "color": "black"
        },
        {
          "id": 3,
          "label": "Medium",
          "value": 1002,
          "color": ["green"]
        },
        {
          "id": 2,
          "label": "High",
          "value": 20,
          "color": ["orange"]
        },
        {
          "id": 1,
          "label": "Critical",
          "value": 0,
          "color": ["red","red"]
        }
      ]
    }
  ];
  if(data.results) {
    data.results.map((item) => {
          if(item.severity === "Low" || item.severity === "Unknown" || item.severity === "Everything else") {
            totalLow += 1;
          }
          if(item.severity === "High") {
            totaHeight += 1;
          }
          if(item.severity === "Medium") {
            totalMedium += 1;
          }
          if(item.severity === "Critical") {
            totalCritical += 1;
          }
        }
    );
  } else {
    data.data.map((item) => {
          if(item.severity === "Low" || item.severity === "Unknown" || item.severity === "Everything else") {
            totalLow += 1;
          }
          if(item.severity === "High") {
            totaHeight += 1;
          }
          if(item.severity === "Medium") {
            totalMedium += 1;
          }
          if(item.severity === "Critical") {
            totalCritical += 1;
          }
        }
    );
  }

  to[2].values.forEach((item)=>{
    if(item.label === "Low") {
      item.value = totalLow
    }
    if(item.label === "High") {
      item.value = totaHeight
    }
    if(item.label === "Medium") {
      item.value = totalMedium
    }
    if(item.label === "Critical") {
      item.value = totalCritical
    }
  })
  const sortedCurrentValuesNew = ["1","2","3","4"];
  return (
      <div>
        <div>
          <Statistics
              data={to}
              iterationTimeout={100}
              sortkey={sortedCurrentValuesNew}
              checkTotal={true}
          />
        </div>
      </div>
  );
}

// LanguageStatistics.propTypes = {
//   data:  PropTypes.any.isRequired,
//   // index: PropTypes.any.isRequired,
//   // value: PropTypes.any.isRequired,
// };
