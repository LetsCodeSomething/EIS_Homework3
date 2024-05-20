import React from 'react';
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from 'react-dom/client';

import * as d3 from "d3";

export function Graph(props) {
    //--------------------------------------------
    const GRAPH_TYPE_DOTS = 0;
    const GRAPH_TYPE_HISTOGRAM = 1;
    const GRAPH_TYPE_LINES_ANIMATED = 2;

    const OX_TYPE_STORE = 0;
    const OX_TYPE_UNEMPLOYMENT = 1;
    //--------------------------------------------

    const [graphType, setGraphType] = React.useState(GRAPH_TYPE_DOTS);
    const [displayMinValues, setDisplayMinValues] = React.useState(true);
    const [displayMaxValues, setDisplayMaxValues] = React.useState(false);
    const [oxType, setOxType] = React.useState(OX_TYPE_STORE);

    const svgRef = React.useState(null);
    React.useEffect(() => {
        let svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
    }, [graphType, svgRef]);
    
    const storeRadioButtonClicked = () => {
        setOxType(OX_TYPE_STORE);
    };

    const unemploymentRadioButtonClicked = () => {
        setOxType(OX_TYPE_UNEMPLOYMENT);
    };

    const minCheckboxClicked = () => {
        setDisplayMinValues(!displayMinValues);
    };

    const maxCheckboxClicked = () => {
        setDisplayMaxValues(!displayMaxValues);
    };

    return (
        <>
            <b>График</b>
            <p>Значение по оси OX</p>
            <input type="radio" onClick={storeRadioButtonClicked} name="ox" checked={oxType === OX_TYPE_STORE ? true : false}/>
                <label>Магазин</label><br/>
            <input type="radio" onClick={unemploymentRadioButtonClicked} name="ox" checked={oxType === OX_TYPE_UNEMPLOYMENT ? true : false}/>
                <label>Безработица</label><br></br>
            <p>Значение по оси OY</p>
            <input type="checkbox" onClick={minCheckboxClicked} checked={displayMinValues}/>
                <label>Минимальные продажи за неделю</label><br/>
            <input type="checkbox" onClick={maxCheckboxClicked} checked={displayMaxValues}/>
                <label>Максимальные продажи за неделю</label><br/>
            <svg></svg>
        </>
    );
}