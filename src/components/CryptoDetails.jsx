import React, { useEffect, useState } from 'react'
import {Paper,
    Typography,
     AppBar,
    Toolbar,
     Container,
     TableRow,
    TableContainer,
    TableCell,
    TableBody,
    Table, Box
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

Chart.register(...registerables)

const CryptoDetails = ({ id }) => {
    const [chartData, setChartData] = useState([])
    const [coinDetails, setCoinDetails] = useState({})
    const [loading, setLoading] = useState(false)
    const [current,setCurrent]=useState()



    useEffect(() => {
        getDetails(id)
    }, [id])

    async function getDetails(id) {
        setLoading(true)

        const data = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=365&interval=daily`)
        const coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        
        console.log(data)
  
        setCurrent(coinData?.data[0].current_price)
        
        const details = data?.data?.prices?.map((element) => ({
            time: new Date(element[0]).toLocaleDateString("en-GB"),
            value: element[1]
        }
        ))

        setChartData(details)
        if (coinData)
            setCoinDetails(coinData.data)
        setLoading(false)

    }

    
    const labels = chartData?.map((element) => (element.time))
    const details = chartData?.map((element) => (element.value))
    const setColorUp=(ctx,value)=>ctx.p0.parsed.y>current ? value: undefined
    const setColorDown=(ctx,value)=>ctx.p0.parsed.y<current ? value: undefined
    const todayData=generateData(current)

    const data = {
        labels: labels,
        datasets: [{
            label:`Price Today: ₹${current}`,
            data: todayData,
            borderColor: 'rgba(0,0,155,1)',
            borderWidth: 2,
            pointRadius: 0,

        },{
            label: '₹',
            data: details,
            fill: {
                target: {
                    value: `${current}`
                },
                below: 'rgba(155,0,0,0.5)',
                above: 'rgba(0,155,0,0.5)'

            },
            pointBorderColor:"red",
            borderColor: 'rgba(0,155,0,0.5)',
            segment:{
                borderColor: ctx=> setColorUp(ctx,'rgba(0,155,0,1)') || setColorDown(ctx,'rgba(155,0,0,1)')
            },
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
        }]
    };

function generateData(value){
    let arr=[]
    for (let i = 0; i < details.length; i++) {
       arr.push(value)
        
    }
    return arr
}
    

    

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {

                ticks: {
                    maxTicksLimit: 6,
                },
                grid: {
                    borderColor: "rgba(0,0,0,0.5)",
                    lineWidth: 1.5,
                    drawTicks: false,
                    borderWidth: 1.5
                }
            },
            x: {
                ticks: {
                    maxTicksLimit: 7,
                },
                grid: {
                    display: false,
                    borderColor: "rgba(0,0,0,0.5)",
                    borderWidth: 1.5
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Trend Over a year"
            },
            legend: {
                onClick:()=>{return}, 
                labels:{
                    filter: (legendItem,chartData)=>(legendItem.text!=='₹')
                    
                },
            },
            tooltip:{
                enabled: false
            }
        }

    }
    return (
        <div className="cryptoDetails">
            {loading ? <div className="loader">
                <span className="loadImg"></span>
                <p>Loading</p>
            </div> : <>
                <AppBar position="sticky" style={{ marginBottom: "20px", backgroundColor: "rgba(66, 197, 245,1)" }}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            <Link to="/">Coin Tracker</Link>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container sx={{display:'flex', alignItems:"center", justifyContent: 'space-between', my:2}}>
                    <img src={coinDetails[0]?.image} alt="" />
                    <Typography sx={{flexGrow:1, mx:2}} variant='h5'>{coinDetails[0]?.name}</Typography>
                    <Typography  variant='h5'>24h change :</Typography>
                    <Box sx={{display: "flex", alignItems:"center"}}>
                        {coinDetails[0]?.price_change_percentage_24h>0 ? <KeyboardArrowUpIcon color='success' sx={{mx:1}}/>: <KeyboardArrowDownIcon color='error' sx={{mx:1}}/> }
                    <Typography color={coinDetails[0]?.price_change_percentage_24h>0 ? "success.main": "error.main"} variant='h5'>{coinDetails[0]?.price_change_percentage_24h}%</Typography>
                    </Box>
                </Container>

                <div className="container">
                    <Paper elevation={3} style={{ padding: "20px 10px", margin: "0 10px", minWidth: "50%" }}>
                        <Line data={data} options={options} />
                    </Paper>

                    <div className="details">
                        <Paper elevation={3} style={{ padding: "20px 10px" }} >
                            <TableContainer >
                                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                                <TableCell style={{ borderBottom: "none" }} align="left"><img src={coinDetails[0]?.image} alt="" /></TableCell>
                                                <TableCell style={{ borderBottom: "none" }} align="right"><h2 >{coinDetails[0]?.name}</h2></TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Rank</TableCell>
                                            <TableCell align="right">{coinDetails[0]?.market_cap_rank}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Price</TableCell>
                                            <TableCell align="right">₹ {coinDetails[0]?.current_price.toLocaleString('en-IN')}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Market Cap</TableCell>
                                            <TableCell align="right">₹ {coinDetails[0]?.market_cap.toLocaleString('en-IN')}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Total volume</TableCell>
                                            <TableCell align="right">₹ {coinDetails[0]?.total_volume.toLocaleString('en-IN')}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">24h High / Low</TableCell>
                                            <TableCell align="right">₹ {coinDetails[0]?.high_24h.toLocaleString('en-IN')} / ₹ {coinDetails[0]?.low_24h.toLocaleString('en-IN')}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Circulating Supply</TableCell>
                                            <TableCell align="right">₹ {coinDetails[0]?.circulating_supply.toLocaleString('en-IN')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
            </>}
        </div>
    )
}

export default CryptoDetails
