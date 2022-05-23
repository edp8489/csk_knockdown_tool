import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
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

const colorNames = Object.keys(tableau10Hex);

export function genScatterPlot(rawData, xLabel, yLabel, titleText){
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
    // @TODO Set text color (ChartJS.defaults.color) based on darkMode

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
        //todo
        console.log("el: ")
        console.log(el)
        let label = "d = " + el.d + " in"
        let xData = el.tcsk_t
        let yData = el.Kcsk
        let borderColor = T10RGB[colorNames[ind]]
        //console.log(borderColor)
        let backgroundColor = T10RGB50A[colorNames[ind]]
        //console.log(backgroundColor)
        let dataTuples = xData.map((x, ind) => {return {x: x, y:yData[ind]}})

        // package everything
        let dataset_i = {
            label: label,
            data: dataTuples,
            pointBorderColor: borderColor,
            pointBackgroundColor: backgroundColor,
            borderColor: backgroundColor,
            backgroundColor:backgroundColor,
            showLine: true
        }
        return dataset_i
    })
    console.log(formattedData)

    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Title, Legend);
    return <Scatter options={options} data={formattedData} />
    //return {options, formattedData}
}
