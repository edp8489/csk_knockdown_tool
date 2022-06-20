import { Scatter } from 'react-chartjs-2';
import {
    //Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend,
  } from 'chart.js';

export const tableau10Hex = {
    blue: "#5778a4",
    orange: "#e49444",
    red: "#d1615d",
    teal: "#85b6b2",
    green: "#6a9f58",
    yellow: "#e7ca60",
    purple: "#a87c9f",
    pink: "#f1a2a9",
    brown: "#967662",
    grey: "#b8b0ac"
}

export const T10RGB = {
    blue: "rgba(87, 120, 164, 1)",
    orange: "rgba(228, 148, 68, 1)",
    red: "rgba(209, 97, 93, 1)",
    teal: "rgba(133, 182, 178, 1)",
    green: "rgba(106, 159, 88, 1)",
    yellow: "rgba(231, 202, 96, 1)",
    purple: "rgba(168, 124, 159, 1)",
    pink: "rgba(241, 162, 169, 1)",
    brown: "rgba(150, 118, 98, 1)",
    grey: "rgba(184, 176, 172, 1)"
}

export const T10RGB50A = {
    blue: "rgba(87, 120, 164, 0.5)",
    orange: "rgba(228, 148, 68, 0.5)",
    red: "rgba(209, 97, 93, 0.5)",
    teal: "rgba(133, 182, 178, 0.5)",
    green: "rgba(106, 159, 88, 0.5)",
    yellow: "rgba(231, 202, 96, 0.5)",
    purple: "rgba(168, 124, 159, 0.5)",
    pink: "rgba(241, 162, 169, 0.5)",
    brown: "rgba(150, 118, 98, 0.5)",
    grey: "rgba(184, 176, 172, 0.5)"
}

export const colorNames = Object.keys(tableau10Hex);

export function formatData(xData, yData, seriesName) {
    /*
    Utility function to format dataset for use in ChartJS
    
    Inputs:
        xData: array of x-axis data points
        yData: array of y-axis data points
        seriesName: Label for data series (legend entry)

    Returns: 
        series = {
                    label: seriesName,
                    data: [
                        {
                        x: #,
                        y: #
                        }
                    ],
                    borderColor: ...,
                    backgroundColor: ...
                }
    
    Usage: 
    Formatted series can be appended to "datasets" array in CJS data object:
        data = {
            datasets: [
                series, ...
            ],
        }
    */

    const dataTuples = xData.map((x, ind) => {return {x: x, y:yData[ind]}})

    const series = {
        label: seriesName,
        data: dataTuples
    }

    return series

}

export function fmtEnvPlotData(dataObj){
    /*
    Formats data for use in plot of data points w/ bearing-shear strength envelope

    INPUTS
        dataObj: {
            points: [{
                d = number,
                tsht: [],
                Pult: []
            }],
            envelope: [{
                d: number,
                tenv: [],
                Penv: []
            }]
        }
    
    RETURNS
        formattedData: {
        datasets: [
                    {
                    label: "",
                    data: [
                        {
                        x: (scalar),
                        y: (scalar)
                        }
                    ]
                    }
                ]
        }
    */
    
    const ultPts = dataObj.points.map((el, ind) => {
        //console.log("el: ")
        //console.log(el)
        let label = "d = " + el.d + " in"
        let xData = el.tsht
        let yData = el.Pult
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)

        // format x- and y- data arrays in ChartJS structure
        let dataset_i = formatData(xData,yData,label)
        
        // add additional options
        dataset_i = {
            ...dataset_i,
            ...{
                pointBorderColor: borderColor,
                pointBackgroundColor: backgroundColor,
                borderColor: backgroundColor,
                backgroundColor:backgroundColor,
                showLine: true
            }
        }
        return dataset_i
    })

    const envPlots = dataObj.envelope.map((el, ind) => {
        //todo
        console.log("Generating envelope plot")
        //console.log("el: ")
        //console.log(el)
        let label = "Strength Envelope"
        //let xData = rawData.points[ind].tsht
        let xData = el.tenv 
        let yData = el.Penv
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)

        // format x- and y- arrays into ChartJS structure
        let dataset_i = formatData(xData,yData,label)

        // add additional options
        dataset_i = {
            ...dataset_i,
            ...{
                pointRadius: 0,
                borderColor: borderColor,
                backgroundColor:backgroundColor,
                borderDash: [10, 10],
                showLine: true
                }
            }
        return dataset_i
    })

    // alternate between data points and envelope plots so legend entries are grouped
    let formattedData = {datasets:[]}
    ultPts.forEach((el, ind) =>{
        formattedData['datasets'].push(el)
        // only add envelope plot if it correlates w/ same diameter fastener
        if (dataObj.envelope[ind].d === dataObj.points[ind].d){
            formattedData['datasets'].push(envPlots[ind])}
    })
    console.log("formatted envelope plot data obj:")
    console.log(formattedData)
    return formattedData
}

export function fmtKndPlotData(dataObj){
    /*
    Formats data for use in plot of data points w/ bearing-shear strength envelope

    INPUTS
        dataObj: [{
            d: (scalar) fastener diameter
            tcsk_t: (array)
            Kcsk: (array)
        }]

    RETURNS
      Object in ChartJS syntax
        formattedData: {
          datasets: [
                    {
                    label: "",
                    data: [
                        {
                        x: (scalar),
                        y: (scalar)
                        }
                    ]
                    }
                ]
        }
    */
    let formattedData = {}
    formattedData["datasets"] = dataObj.map((el, ind) => {
        //console.log("el: ")
        //console.log(el)
        let label = "d = " + el.d + " in"
        let xData = el.tcsk_t
        let yData = el.Kcsk
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)

        // format x- and y- data arrays into ChartJS structure
        let dataset_i = formatData(xData, yData, label);
        
        // add additional properties to dataset
        dataset_i = {
            ...dataset_i,
            ...{
                pointBorderColor: borderColor,
                pointBackgroundColor: backgroundColor,
                pointRadius:4,
                borderColor: backgroundColor,
                backgroundColor:backgroundColor,
                showLine: true
                }
        }
        return dataset_i
    })

    return formattedData
}