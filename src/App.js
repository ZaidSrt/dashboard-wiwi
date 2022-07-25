// React
import { useEffect, useState } from 'react';

// Material
import { Avatar, Grid, TableFooter, TablePagination, IconButton } from '@mui/material';

// Sidebar
import { ProSidebar, SidebarContent, SidebarHeader, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

// Iconos
import { IoNotificationsOutline, IoSearch, IoLocationOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { AiOutlineFundView, AiOutlineFolderView } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { MdComputer, MdOutlineLastPage, MdOutlineFirstPage, MdKeyboardArrowRight, MdKeyboardArrowLeft, MdOutlineDashboard } from "react-icons/md";
import { TbLayoutCards, TbComponents } from "react-icons/tb";
import { BiLineChart } from "react-icons/bi";
import { BsTable } from "react-icons/bs";

// Colors
import { lightBlue } from '@mui/material/colors';
import { Box } from '@mui/system';

// Chart js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, ArcElement, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Tabla
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Api
import { getViewsByDay, getViews, getViewsByGrafica } from './api/ViewApi';

function App() {

  // State
  const [isCollapse, setIsCollapse] = useState(false);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [views, setViews] = useState(0);
  const [viewsTable, setViewsTable] = useState([]);
  const [viewsGrafica, setViewsGrafica] = useState([]);

  // Peticiones
  useEffect(() => {

    getViewsByDay().then(response => {
      setViews(response.data.length)
    }).catch(err => console.log(err));

    getViews().then(response => {
      setViewsTable(response.data)
    }).catch(err => console.log(err));

    getViewsByGrafica().then(response => {
      setViewsGrafica(response.data)
    }).catch(err => console.log(err));
    
  }, [])

  // Arrow Funcion
  const toggleSearchFocus = () => setIsSearchFocus(!isSearchFocus);
  const toggleCollapse = () => setIsCollapse(!isCollapse);
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  

  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <MdOutlineLastPage /> : <MdOutlineFirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <MdOutlineFirstPage /> : <MdOutlineLastPage />}
        </IconButton>
      </Box>
    );
  }

  // Chart.js

  // Area
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend
  );

  const options = {
    responsive: true,
  };

  const ApiLabel = [];
  const ApiData = [];

  viewsGrafica.forEach(view => {
    ApiLabel.push(view.fecha);
    ApiData.push(view.resultados);
  });

  const labels = ApiLabel;
  const dataArea = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Visitas por día',
        data: ApiData,
        borderColor: 'rgb(3, 169, 244)',
        backgroundColor: 'rgba(3, 169, 244, .5)',
      },
    ],
  };

  // Doughnut
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
  );
  
  const dataDoughnut = {
    labels: ApiLabel,
    datasets: [
      {
        label: '# of Votes',
        data: ApiData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Tabla

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className='d-flex'>

            {/* Sidevar */}
            <div className='container-sidebar'>
              <ProSidebar collapsed={isCollapse}>
                <SidebarHeader>
                  <h2 className='text-center'>AZ</h2>
                </SidebarHeader>

                <SidebarContent>
                  <Menu>
                    <MenuItem icon={<MdOutlineDashboard />}>Dashboard</MenuItem>
                    <MenuItem icon={<TbLayoutCards />}>Card</MenuItem>
                    <SubMenu title="Graficas" icon={<BiLineChart />}>
                      <MenuItem>Area</MenuItem>
                      <MenuItem>Doughnut</MenuItem>
                    </SubMenu>
                    <MenuItem icon={<TbComponents />}>Componentes</MenuItem>
                    <MenuItem icon={<BsTable />}>Tablas</MenuItem>
                  </Menu>
                </SidebarContent>
              </ProSidebar>
            </div>

            {/* Main */}
            <Grid container spacing={3}>

              <Grid item xs={12}>

                {/* Header */}
                <div className='bg-white container-header'>
                  <Grid container spacing={3} paddingX={3} paddingY={2}>
                    <Grid item xs={12}>
                      <div className='d-flex justify-content-between align-items-center'>

                        <Box sx={{ color: lightBlue[500] }} className='cursor-pointer' onClick={toggleCollapse}>
                          <IoMdMenu size={'2rem'} />
                        </Box>
                      
                        <div className={`input-search ${isSearchFocus ? 'border-cian' : ''}`}>
                          <IoSearch size={'20px'}/>
                          <input type="text" name='dashboard_search' id='dashboard_search' placeholder='Buscar' onFocus={toggleSearchFocus} onBlur={toggleSearchFocus}/>
                        </div>

                        <div className='d-flex align-items-center'>
                          <IconButton aria-label="Ménu" sx={{ color: lightBlue[500], mr: 4 }}>
                            <IoNotificationsOutline size={'24px'} />
                          </IconButton>
                          <Avatar sx={{ bgcolor: lightBlue[500] }}>AZ</Avatar>
                        </div>

                      </div>
                    </Grid>
                  </Grid>
                </div>

                {/* Panel */}
                <div className='container-panel'>
                  <Grid container spacing={4} paddingX={3}>
                    <Grid item xs={12}>

                      <div className='d-flex justify-content-between align-items-center'>
                        <h2 className='text-black'>Dashboard</h2>

                        <button className='btn-prymary btn btn-icon'>
                          <FiDownload size={'18px'} />
                          <span>Generar reporte</span>
                        </button>
                      </div>

                    </Grid>
                  </Grid>

                  {/* CARDS */}
                  <Grid container spacing={4} paddingX={3} paddingY={2}>
                    <Grid item xs={3}>
                      <div className='card card-box-shadow card-db-green'>
                        <div className='card-body'>
                          <div className='card-db'>
                            <div>
                              <p className='card-db-number'>{ views }</p>
                              <p className='card-db-text'>Visitas</p>
                            </div>
                            <div className='card-db-icon'>
                              <AiOutlineFundView size={'40px'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className='card card-box-shadow card-db-purple'>
                        <div className='card-body'>
                          <div className='card-db'>
                            <div>
                              <p className='card-db-number'>index.php</p>
                              <p className='card-db-text'>Pagina mas visitada</p>
                            </div>
                            <div className='card-db-icon'>
                              <AiOutlineFolderView size={'40px'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className='card card-box-shadow card-db-yellow'>
                        <div className='card-body'>
                          <div className='card-db'>
                            <div>
                              <p className='card-db-number'>F8-D9-B8-0D-87-C0</p>
                              <p className='card-db-text'>Nodo</p>
                            </div>
                            <div className='card-db-icon'>
                              <MdComputer size={'40px'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className='card card-box-shadow card-db-blue'>
                        <div className='card-body'>
                          <div className='card-db'>
                            <div>
                              <p className='card-db-number'>5C-95-AE-55-DC-C9</p>
                              <p className='card-db-text'>mac</p>
                            </div>
                            <div className='card-db-icon'>
                              <IoLocationOutline size={'40px'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>

                  {/* Graficas */}
                  <Grid container spacing={4} paddingX={3}>
                    <Grid item xs={8}>
                      <div className='card card-box-shadow'>
                        <div className='card-head'>
                          <span>Concentrado de visitas</span>
                        </div>
                        <div className='card-body'>
                          <Line options={options} data={dataArea} />
                        </div>
                        <div className='card-footer'></div>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className='card card-box-shadow'>
                        <div className='card-head'>
                          <span>Concentrado de visitas</span>
                        </div>
                        <div className='card-body'>
                          <Doughnut data={dataDoughnut} />
                        </div>
                        <div className='card-footer'></div>
                      </div>
                    </Grid>
                  </Grid>


                  <Grid container spacing={4} paddingX={3} paddingY={2}>
                    <Grid item xs={12}>
                      <div className='card card-box-shadow'>
                        <div className='card-head'>
                          <span>Concentrado de visualizaciones</span>
                        </div>
                        <div className='card-body'>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>id</TableCell>
                                  <TableCell align="right">mac</TableCell>
                                  <TableCell align="right">nodo</TableCell>
                                  <TableCell align="right">disparo</TableCell>
                                  <TableCell align="right">fecha</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(rowsPerPage > 0
                                    ? viewsTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : viewsTable
                                  ).map((row) => (
                                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope="row">{row.id}</TableCell>
                                    <TableCell align="right">{row.mac}</TableCell>
                                    <TableCell align="right">{row.nodo}</TableCell>
                                    <TableCell align="right">{row.disparo}</TableCell>
                                    <TableCell align="right">{row.fecha}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={viewsTable.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                      inputProps: {
                                        'aria-label': 'rows per pag',
                                      },
                                      native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                  />
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </TableContainer>
                        </div>
                        <div className='card-footer'></div>
                      </div>
                    </Grid>
                  </Grid>
                </div>                
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );

}

export default App;
