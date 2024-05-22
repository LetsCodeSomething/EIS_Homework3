import React from 'react';
//import { useEffect, useMemo, useRef, useState } from "react";
//import ReactDOM from 'react-dom/client';

import * as d3 from "d3";

export function Graph(props) {
    const GraphType = {
        Dot: 0, Histogram: 1, Animated: 2
    };

    const OxAxisType = {
        Store: "Store", Unemployment: "Unemployment"
    };
    
    const marginX = 50;
    const marginY = 50;
    const height = 400;
    const width = 800; 

    const [graphType, setGraphType] = React.useState(GraphType.Dot);
    const [displayMinValues, setDisplayMinValues] = React.useState(true);
    const [displayMaxValues, setDisplayMaxValues] = React.useState(false);
    const [oxAxisType, setOxAxisType] = React.useState(OxAxisType.Store);

    const graphData = React.useMemo(() => {
        let groupObj = d3.group(props.dataset, d => d[oxAxisType]);
        let groupedData =[];
    
        for(const entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d["Weekly_Sales"]));
            groupedData.push({labelX : entry[0], values : minMax});
        }

        return groupedData;
    }, [oxAxisType]);

    const [scaleX, scaleY] = React.useMemo(() => {
        if(!displayMinValues && !displayMaxValues) {
            return [null, null];
        }

        let firstRange = d3.extent(graphData.map(d => d.values[0]));
        let secondRange = d3.extent(graphData.map(d => d.values[1]));

        const min = displayMinValues ? firstRange[0] : secondRange[0]; 
        const max = displayMinValues ? (displayMaxValues ? secondRange[1] : firstRange[1]) : secondRange[1];
        
        let scaleX = d3.scaleBand()
            .domain(graphData.map(d => d.labelX))
            .range([0, width - 2 * marginX]);
   
        let scaleY = d3.scaleLinear()
            .domain([min * 0.85, max * 1.1 ])
            .range([height - 2 * marginY, 0]);

        return [scaleX, scaleY];
    }, [graphData, displayMinValues, displayMaxValues]);

    const svgRef = React.useRef(null);
    //Main drawing function.
    React.useEffect(() => {
        if(!scaleX) {
            alert("Не выбраны значения для отрисовки на графике");
            return;
        }

        let svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        if (displayMinValues) 
        {
            drawGraph(svg, 0, "blue");
        }
        if (displayMaxValues) 
        {
            drawGraph(svg, 1, "red");
        }
    }, [graphType]);
    
    const drawGraph = (svg, minMaxIndex, color) => {
        //Draw the axes.
        let axisX = d3.axisBottom(scaleX);
        let axisY = d3.axisLeft(scaleY);
    
        svg.append("g")
            .attr("transform", `translate(${marginX}, ${height - marginY})`)
            .call(axisX)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-45)");
   
        svg.append("g")
            .attr("transform", `translate(${marginX}, ${marginY})`)
            .call(axisY);

        //Draw the data.
        if(graphType === GraphType.Dot) {
            const r = 4;
            const offset = (minMaxIndex == 0)? -r / 2 : r / 2;
        
            svg.selectAll(".dot")
                .data(graphData)
                .enter()
                .append("circle")
                .attr("r", r)
                .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                .attr("cy", d => scaleY(d.values[minMaxIndex]) + offset)
                .attr("transform", `translate(${marginX}, ${marginY})`)
                .style("fill", color);
        }
        else if(graphType === GraphType.Histogram) {
            const barWidth = 5.0;
            const offset = (minMaxIndex == 0) ? -barWidth / 2 : barWidth / 2;
            svg.selectAll(".dot")
                .data(graphData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                .attr("height", d => height - marginY * 2 - scaleY(d.values[minMaxIndex]))
                .attr("transform", d => `translate(${marginX - barWidth / 2 + offset},${marginY + scaleY(d.values[minMaxIndex])})`)
                .style("fill", color);
        }
    };

    //--------------------------------------------

    const storeRadioButtonClicked = () => {
        setOxAxisType(OxAxisType.Store);
    };

    const unemploymentRadioButtonClicked = () => {
        setOxAxisType(OxAxisType.Unemployment);
    };

    const minCheckboxClicked = () => {
        setDisplayMinValues(!displayMinValues);
    };

    const maxCheckboxClicked = () => {
        setDisplayMaxValues(!displayMaxValues);
    };
    
    const dotsRadioButtonClicked = () => {
        setGraphType(GraphType.Dot);
    };

    const histogramRadioButtonClicked = () => {
        setGraphType(GraphType.Histogram);
    };

    const animatedRadioButtonClicked = () => {
        setGraphType(GraphType.Animated);
    };

    return (
        <>
            <b>График</b>
            <p>Значение по оси OX</p>
            <input type="radio" onClick={storeRadioButtonClicked} name="oxType" checked={oxAxisType === OxAxisType.Store}/>
                <label>Магазин</label><br/>
            <input type="radio" onClick={unemploymentRadioButtonClicked} name="oxType" checked={oxAxisType === OxAxisType.Unemployment}/>
                <label>Безработица</label><br/>
            
            <p>Значение по оси OY</p>
            <input type="checkbox" onClick={minCheckboxClicked} checked={displayMinValues}/>
                <label>Минимальные продажи за неделю</label><br/>
            <input type="checkbox" onClick={maxCheckboxClicked} checked={displayMaxValues}/>
                <label>Максимальные продажи за неделю</label><br/>
            
            <p>Тип графика</p>
            <input type="radio" onClick={dotsRadioButtonClicked} name="graphType" checked={graphType === GraphType.Dot}/>
                <label>Точечный</label><br/>
            <input type="radio" onClick={histogramRadioButtonClicked} name="graphType" checked={graphType === GraphType.Histogram}/>
                <label>Столбчатый</label><br/>
            <input type="radio" onClick={animatedRadioButtonClicked} name="graphType" checked={graphType === GraphType.Animated}/>
                <label>Анимированные линии</label><br/>
            <p></p>

            <input type="button" value="Построить"/>
            <input type="button" value="Выполнить шаг"/>
            <input type="button" value="Проиграть анимацию"/>
            <input type="button" value="Стереть"/><br/>
            
            <svg ref={svgRef} width={width} height={height}></svg>
        </>
    );
}