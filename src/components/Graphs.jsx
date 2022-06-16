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

  export function DataEnvPlot(props){
    /*
    Component wrapper for ChartJS scatter plot, customized for selected data series with
    bearing-shear envelope overlays

    Props:
      CJS: ChartJS instance from app
      data: dataset formatted per ChartJS syntax
    */

    const { CJS, data } = props;

    // define plotting options
    const options = {
        scales: {
            x:{
                type:"linear",
                //min: 0,
                //max: 1,
                beginAtZero: true,
                title: {
                    display:true, 
                    text: "Sheet thickness (t) [in]"
                  }
            },
            y:{
                type:"linear",
                //min:0.5,
                //max:1.1,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Joint Ultimate Strength [lbf]"
                  }
            }
        },
        plugins: {
            legend:{
                position: "top"
            },
            title:{
                display: true,
                text: "Joint Ultimate Strength w/ Bearing-Shear Envelope"
            }
        }
    }


   CJS.register(LinearScale, PointElement, LineElement, Tooltip, Title, Legend);
  return <Scatter options={options} data={data} />
  }

  export function KcskPlot(props){
    /*
    Component wrapper for ChartJS scatter plot, customized for calculated Kcsk knockdown
    based on selected data set

    Props:
      CJS: ChartJS instance from app
      data: Kcsk data formatted per ChartJS syntax
    */

    const {CJS, data} = props;

    const options = {
      scales: {
          x:{
              type:"linear",
              min: 0,
              max: 1,
              beginAtZero: true,
              title: {
                  display:true, 
                  text: "Countersink Depth Ratio (tcsk / t) [-]"
                }
          },
          y:{
              type:"linear",
              min:0.5,
              max:1.1,
              beginAtZero: true,
              title: {
                  display: true,
                  text: "Joint Strength Knockdown (Kcsk) [-]"
                }
          }
      },
      plugins: {
          legend:{
              position: "right"
          },
          title:{
              display: true,
              text: "Joint Ultimate Strength Knockdown (nominal data)"
          }
      }
  }

    CJS.register(LinearScale, PointElement, LineElement, Tooltip, Title, Legend);
    return <Scatter options={options} data={data} />
  }