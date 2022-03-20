import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table, TableBody,
  TableCell, TableContainer,
  TableHead, TableRow,
  Paper, AppBar,
  Toolbar, Typography,
  TextField, Card,
  Button, Container,
  CardActionArea
} from '@mui/material';



const HomePage = ({ currentCoins, allData, length, setCurrentPage, currentPage, trending }) => {
  const [searchValue, setSearchValue] = useState("")
  const [searchedCoins, setSearchedCoins] = useState([])

  const pageNo = []
  const coinsPerpage = 10

  useEffect(() => {
    if (searchValue) {
      const searchData = allData?.filter((element) => {
        return element.name.toLowerCase().includes(searchValue.toLowerCase())
      })
      setSearchedCoins(searchData)
    }
    else if (searchValue === null || undefined || "" || " ")
      setSearchedCoins([])

  }, [searchValue, allData])



  for (let i = 1; i <= Math.ceil(length / coinsPerpage); i++) {
    pageNo.push(i)
  }

  function formatter(number) {
    if (number < 999)
      return `${parseFloat(number).toLocaleString('en-IN')}`
    if (number > 999 && number < 99999)
      return `${parseFloat((number / 1000).toFixed(2)).toLocaleString('en-IN')} K`
    if (number > 99999 && number < 9999999)
      return `${parseFloat((number / 100000).toFixed(2)).toLocaleString('en-IN')} L`
    if (number > 9999999)
      return `${parseFloat((number / 10000000).toFixed(2)).toLocaleString('en-IN')} Cr`
  }





  return (
    <>
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
          <TextField placeholder='Search Coins' size="small" style={{ padding: '5px' }} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} />
        </Toolbar>
      </AppBar>
      <Container sx={{ mb: 2 }}>
        <Typography variant='h4'>Top Trending Crypto coins</Typography>
      </Container>
      <Container sx={{ display: "flex", justifyContent: 'space-between' }}>
        {trending.map((element, index) => (
          <Card key={index} sx={{
            maxWidth: "250px", p: 1,
            ':hover': {
              boxShadow: 5,
            }
          }} >
              <CardActionArea component={Link} to={`/details/${element.id}`} >
                <TableContainer>
                  <TableRow >
                    <TableCell style={{ borderBottom: "none" }}>
                      <img src={element.image} alt="" />
                    </TableCell >
                    <TableCell style={{ borderBottom: "none" }}>
                      <h4>{element.name}</h4>
                    </TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell style={{ borderBottom: "none" }}>
                      Price
                    </TableCell>
                    <TableCell align='center' style={{ borderBottom: "none" }}>
                      ₹ {formatter(element.current_price)}
                    </TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell style={{ borderBottom: "none" }}>
                      24h
                    </TableCell>
                    <TableCell align='center' style={{ borderBottom: "none" }}>
                      {element.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                </TableContainer>
                
              </CardActionArea>
          </Card>
        ))}
      </Container>
      <div style={{ margin: "30px" }}>
        <Paper elevation={4} style={{ padding: "10px" }}>
          <TableContainer >
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><h2>#</h2> </TableCell>
                  <TableCell align='left'><h2>Coin</h2> </TableCell>
                  <TableCell align="right"> <h2>Price</h2> </TableCell>
                  <TableCell align="right"><h2>Circulating  Supply</h2> </TableCell>
                  <TableCell align="right"><h2>24h change</h2> </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedCoins.length > 0 ? searchedCoins.map((element) => (
                  <TableRow key={element.name}>
                    <TableCell >{element.market_cap_rank}</TableCell>
                    <TableCell >
                      <TableCell style={{ borderBottom: "none" }}>
                        <img src={element.image} alt="" />
                      </TableCell>
                      <TableCell style={{ borderBottom: "none" }}>
                        {element.name}
                      </TableCell>
                    </TableCell>
                    <TableCell align="right">₹ {formatter(element.current_price)}</TableCell>
                    <TableCell align="right">{element.circulating_supply + " "}{element.symbol.toUpperCase()} </TableCell>
                    <TableCell align="right">{element.price_change_percentage_24h > 0 ? "+" + element.price_change_percentage_24h.toFixed(2) : element.price_change_percentage_24h.toFixed(2)} %</TableCell>
                    <TableCell align="right">
                      <Button variant='contained'>
                        <Link to={`/details/${element.id}`}>Know More</Link> </Button></TableCell>
                  </TableRow>
                )) : currentCoins?.map((element) => (
                  <TableRow key={element.name}>
                    <TableCell >{element.market_cap_rank}</TableCell>
                    <TableCell >
                      <TableCell style={{ borderBottom: "none" }}>
                        <img src={element.image} alt="" />
                      </TableCell>
                      <TableCell style={{ borderBottom: "none" }}>
                        {element.name}
                      </TableCell>
                    </TableCell>
                    <TableCell align="right">₹ {formatter(element.current_price)}</TableCell>
                    <TableCell align="right">{element.circulating_supply + " "}{element.symbol.toUpperCase()} </TableCell>
                    <TableCell align="right">{element.price_change_percentage_24h > 0 ? "+" + element.price_change_percentage_24h.toFixed(2) : element.price_change_percentage_24h.toFixed(2)} %</TableCell>
                    <TableCell align="right">
                      <Button variant='contained' >
                        <Link to={`/details/${element.id}`}>Know More</Link> </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination">
            <div className="currentPage"> <Typography variant='h6'>Page {currentPage}</Typography> </div>
            <table>
              <tbody>
                <tr>{pageNo.map((element) => (
                  <td><Button variant='outlined' onClick={() => {
                    setCurrentPage(element)
                  }
                  }>{element}</Button></td>
                ))}</tr>
              </tbody>
            </table>
          </div>
        </Paper>
      </div>
    </>
  )
}

export default HomePage
