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

export function genKcskPlot(CJS, rawData, xLabel, yLabel, titleText){
    // define plotting options
    const options = {
        scales: {
            x:{
                type:"linear",
                min: 0,
                max: 1,
                beginAtZero: true,
                title: {
                    display:true, 
                    text:xLabel}
            },
            y:{
                type:"linear",
                min:0.5,
                max:1.1,
                beginAtZero: true,
                title: {
                    display: true,
                    text: yLabel}
            }
        },
        plugins: {
            legend:{
                position: "right"
            },
            title:{
                display: true,
                text: titleText
            }
        }
    }

    // prepare raw data for plotting
    /* content:
        data = {
            datasets: [
                {
                    label: "d = ## in",
                    data: [
                        {
                        x: [],
                        y: []
                        }
                    ],
                    borderColor: "",
                    backgroundColor: ""
                }
            ],
        }
    */
    let formattedData = {}
    formattedData["datasets"] = rawData.map((el, ind) => {
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
    //console.log(formattedData)

    CJS.register(LinearScale, PointElement, LineElement, Tooltip, Title, Legend);
    return <Scatter options={options} data={formattedData} />
}



export function genEnvPlot(CJS, rawData, xLabel, yLabel, titleText){
    /*
        rawData = {
            points: [selectedData.dataset],
            Penv: [nomCsk.Penv]
        }
    */
    // define plotting options
    //console.log(rawData)
    const options = {
        scales: {
            x:{
                type:"linear",
                //min: 0,
                //max: 1,
                beginAtZero: true,
                title: {
                    display:true, 
                    text:xLabel}
            },
            y:{
                type:"linear",
                //min:0.5,
                //max:1.1,
                beginAtZero: true,
                title: {
                    display: true,
                    text: yLabel}
            }
        },
        plugins: {
            legend:{
                position: "top"
            },
            title:{
                display: true,
                text: titleText
            }
        }
    }

    // prepare raw data for plotting
    /* content:
        data = {
            datasets: [
                {
                    label: "d = ## in",
                    data: [
                        {
                        x: [],
                        y: []
                        }
                    ],
                    borderColor: "",
                    backgroundColor: ""
                }
            ],
        }
    */
    let formattedData = {}
    let ultPts = rawData.points.map((el, ind) => {
        //console.log("el: ")
        //console.log(el)
        let label = "d = " + el.d + " in"
        let xData = el.tsht
        let yData = el.Pult
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)
        //let dataTuples = xData.map((x, ind) => {return {x: x, y:yData[ind]}})

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
    //console.log(formattedData)
    const envPlots = rawData.nomKcsk.map((el, ind) => {
        //todo
        console.log("Generating envelope plot")
        //console.log("el: ")
        //console.log(el)
        let label = "Strength Envelope"
        //let xData = rawData.points[ind].tsht
        let xData = el.plotPenv? el.plotPenv.tenv : []
        let yData = el.plotPenv? el.plotPenv.Penv: []
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)
        let dataTuples = xData.map((x, ind) => {return {x: x, y:yData[ind]}})

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
    //formattedData["datasets"].append(envPlots)
    formattedData["datasets"] = ultPts.concat(envPlots)
    //console.log(formattedData)

    CJS.register(LinearScale, PointElement, LineElement, Tooltip, Title, Legend);
    return <Scatter options={options} data={formattedData} />
}