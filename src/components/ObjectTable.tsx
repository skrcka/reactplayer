import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {
    Input,
} from 'reactstrap';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Schedule } from '../models/Schedule';
import {
    useState, useEffect, useRef, RefObject,
} from 'react';

import Loader from './Loader';


function Row(props: {
        row: Schedule,
        highlightedObjekt?: number | null,
        tableLoc?: RefObject<HTMLTableElement>,
        // types: { [id: number]: string },
        // layers: { [id: number]: string },
        onEdit: (id: number, type_id: number, schedule: string) => void,
        onDelete: (id: number) => void,
        onSelect: (id: number, zoom: boolean) => void,
        expandable: boolean}) {
    const {
        row,
        highlightedObjekt,
        tableLoc,
        // types,
        // layers,
        onEdit,
        onSelect,
        onDelete,
        expandable,
    } = props;

    const [
        open,
        setOpen,
    ] = React.useState(false);

    const rowLoc = useRef<HTMLTableRowElement>(null);
    const extraLoc = useRef<HTMLTableRowElement>(null);
    const deleteLoc = useRef<HTMLButtonElement>(null);
    const descLoc = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!open) {
            return;
        };
        if(!extraLoc) {
            return;
        }
        setTimeout(() => {
            extraLoc.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'start',
            });
        }, 200);
    }, [ open ]);

    useEffect(() => {
        if(!tableLoc?.current || !rowLoc.current) {
            return;
        };
        if(highlightedObjekt !== row.id) {
            return;
        };
        // console.log(`table: top: ${tableLoc.current.scrollTop}, height: ${tableLoc.current.scrollHeight}`);
        // console.log(`loc: top: ${rowLoc.current.scrollTop}, height: ${rowLoc.current.scrollHeight}`);
        // rowLoc.current.scrollTop = 100;
        rowLoc.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    }, [ highlightedObjekt ]);

    return (
        <React.Fragment>
            <TableRow
                hover
                sx={{ '& > *': { borderBottom: 'unset' } }}
                onClick={()=>{
                    onSelect(row.id, false);
                }}
                onDoubleClick={() => {
                    onSelect(row.id, true);
                }}
                selected={highlightedObjekt === row.id}
                ref={rowLoc}
                id={`row-${row.id}`}
            >
                <TableCell align="left">{row.id}</TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    align="left"
                >
                    {row.name}
                </TableCell>
                {/* <TableCell align="center">{types[row.TypId]}</TableCell>*/}
                {/* <TableCell align="center">{layers[row.VrstvaId]}</TableCell>*/}
                {/* <TableCell align="center"><img src={pictures[row.ObrazekId]}></img></TableCell> */}
                <TableCell align="center">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => {
                            setOpen(!open);
                            e.stopPropagation();
                        }}
                    >
                        Otevrit
                    </a>
                </TableCell>
                <TableCell align="center">
                    {expandable &&
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={e => {
                            setOpen(!open);
                            e.stopPropagation();
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    }

                </TableCell>
            </TableRow>
            {expandable && (
                <TableRow ref={extraLoc}>
                    <TableCell
                        style={{
                            paddingBottom: 0,
                            paddingTop: 0,
                        }}
                        colSpan={6}
                    >
                        <Collapse
                            in={open}
                            timeout="auto"
                            unmountOnExit
                        >
                            <Box sx={{ margin: 1 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                >
                                    {row.schedule ? 'Popis' : ''}
                                </Typography>
                                <div
                                    style={{ whiteSpace: 'pre-line' }}
                                    ref={descLoc}
                                >{row.schedule}</div>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                    align='right'
                                >

                                    <Button
                                        onClick={()=>onEdit(row.id, row.file_id, row.schedule)}
                                        variant="outlined"
                                        className='m-1'
                                    >
                                    Upravit
                                    </Button>
                                    <Button
                                        onClick={()=>onDelete(row.id)}
                                        variant="outlined"
                                        color="error"
                                        className='m-1'
                                        ref={deleteLoc}
                                    >
                                    Smazat
                                    </Button>
                                </Typography>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
}

interface Props {
    rows?: Array<Schedule>
    highlightedObjekt?: number | null
    // types: { [id: number]: string }
    // layers: { [id: number]: string }
    onEdit: (id: number, file_id: number, schedule: string ) => void
    onDelete: (id: number) => void
    onSelect: (id: number, zoom: boolean) => void
    expandable: boolean
    maxHeight?: number
}

const ObjectTable = ({
    rows,
    highlightedObjekt,
    // types,
    // layers,,
    onEdit,
    onDelete,
    onSelect,
    expandable,
    maxHeight,
}: Props) => {
    const firstUpdate = useRef(true);

    const [
        filteredSortedRows,
        setFilteredSortedRows,
    ] = useState<Array<Schedule>>(rows ? rows : []);

    const [
        sortAttr,
        setSortAttr,
    ] = useState<string>('Id');

    const [
        reverseSort,
        setReverseSort,
    ] = useState<boolean>(false);

    const [
        idFilter,
        setIdFilter,
    ] = useState<number | null>(null);

    const [
        nameFilter,
        setNameFilter,
    ] = useState<string>('');

    const [
        pictureFilter,
        setPictureFilter,
    ] = useState<number | null>(null);

    const [
        expanded,
        setExpanded,
    ] = useState<boolean>(false);

    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);

    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            setLoading(false);
            return;
        }
        if(!rows) {
            return;
        };
        if(!loading){
            setLoading(true);
        }
        let r = rows;
        if(idFilter) {
            r = r.filter(row => row.id == idFilter);
        }
        if(nameFilter){
            r = r.filter(row => row.name.toLowerCase().includes(nameFilter.toLowerCase()));
        }

        setFilteredSortedRows(r.sort(sortingFunc));
        setLoading(false);
    }, [
        rows,
        idFilter,
        nameFilter,
        pictureFilter,
        sortAttr,
        reverseSort,
    ]);

    const tableLoc = useRef<HTMLTableElement>(null);

    const setSortingAttribute = (attr: string) => {
        if(attr == sortAttr){
            setReverseSort(current => !current);
        } else {
            setReverseSort(false);
            setSortAttr(attr);
        }
    };

    const sortingFunc = (a: Schedule, b: Schedule) => {
        const firstName = a.name.toUpperCase();
        const secondName = b.name.toUpperCase();

        switch(sortAttr){
            case 'Id':
                return reverseSort ? b.id - a.id : a.id - b.id;
            case 'Nazev':
                if (firstName < secondName) {
                    return reverseSort ? 1 : -1;
                }
                if (secondName < firstName) {
                    return reverseSort ? -1 : 1;
                }
                return 0;
            default:
                return 0;
        }
    };

    let idTimer: NodeJS.Timeout;
    let nazevTimer: NodeJS.Timeout;
    let pictureTimer: NodeJS.Timeout;

    return(
        <>
            {!expanded && (
                <IconButton
                    aria-label="expand table"
                    size="small"
                    onClick={e => {
                        setExpanded(true);
                        e.stopPropagation();
                    }}
                    className="mt-3"
                >
                    Seznam
                    <KeyboardArrowRightIcon />
                </IconButton>
            )}
            <TableContainer
                component={Paper}
                sx={{
                    height: '100%',
                    maxHeight: maxHeight ? maxHeight : 600,
                    maxWidth: 600,
                }}
                ref={tableLoc}
                className={expanded ? '' : 'd-none'}
            >
                <Table
                    stickyHeader={true}
                >
                    <colgroup>
                        <col style={{ width:'16%' }}/>
                        <col />
                        <col style={{ width:'16%' }}/>
                        <col style={{ width:'12%' }}/>
                        <col style={{ width:'11%' }}/>
                    </colgroup>
                    <TableHead>
                        <TableRow sx={{ '& > *': {
                            backgroundColor: '#121212!important', // #121212
                            color: 'white!important',
                        } }}
                        >
                            <TableCell align="left">
                                <div
                                    className='sorter row'
                                    onClick={()=>{
                                        setSortingAttribute('Id');
                                    }}
                                    style={{ minHeight: '26px' }}
                                ><div className='col'>Id {sortAttr == 'Id' ? (reverseSort ? <KeyboardArrowUpIcon style={{ textAlign: 'right' }} /> : <KeyboardArrowDownIcon />) : ''}</div>
                                </div>
                                <Input
                                    type="number"
                                    name="Id"
                                    id="id"
                                    placeholder="Id"
                                    pattern="[0-9]+"
                                    min={rows ? Math.min(...rows.map(r => r.id)) : 0}
                                    max={rows ? Math.max(...rows.map(r => r.id)) : ''}
                                    onChange={event => {
                                        clearTimeout(idTimer);

                                        idTimer = setTimeout(() => {
                                            if(event.target.value === '0'){
                                                setIdFilter(null);
                                                event.target.value = '';
                                                return;
                                            }
                                            setIdFilter(parseInt(event.target.value));
                                        }, 500);
                                    }}
                                /></TableCell>
                            <TableCell align="left">
                                <div
                                    className='sorter row'
                                    onClick={()=>{
                                        setSortingAttribute('Nazev');
                                    }}
                                    style={{ minHeight: '26px' }}
                                ><div className='col-sm-10'>Název {sortAttr == 'Nazev' ? (reverseSort ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : ''}</div>
                                </div>
                                <Input
                                    type="text"
                                    name="Nazev"
                                    id="name"
                                    placeholder="Název"
                                    onChange={event => {
                                        clearTimeout(nazevTimer);

                                        nazevTimer = setTimeout(() => {
                                            setNameFilter(event.target.value);
                                        }, 500);
                                    }}
                                />
                            </TableCell>
                            {/* <TableCell align="center">Typ</TableCell>*/}
                            {/* <TableCell align="center">Vrstva</TableCell>*/}
                            <TableCell align="left">
                                <div
                                    className='sorter row'
                                    onClick={()=>{
                                        setSortingAttribute('ObrazekId');
                                    }}
                                    style={{ minHeight: '26px' }}
                                ><div className='col col-sm'>Obrázek</div>
                                    <div
                                        className='col col-sm'
                                        style={{
                                            width: '15px',
                                            position: 'absolute',
                                            left: '53px',
                                        }}
                                    >
                                        {sortAttr == 'ObrazekId' ? (reverseSort ? <KeyboardArrowUpIcon style={{ textAlign: 'right' }} /> : <KeyboardArrowDownIcon />) : ''}
                                    </div>
                                </div>
                                <Input
                                    type="select"
                                    name="picture"
                                    id="picture"
                                    defaultValue={0}
                                    onChange={event => {
                                        clearTimeout(pictureTimer);

                                        pictureTimer = setTimeout(() => {
                                            setPictureFilter(parseInt(event.target.value));
                                        }, 500);
                                    }}
                                >
                                    <option
                                        key={'null option'}
                                    >{''}</option>
                                </Input>
                            </TableCell>
                            <TableCell align="center">Mapa</TableCell>
                            <TableCell align="center">
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={e => {
                                        setExpanded(false);
                                        e.stopPropagation();
                                    }}
                                >
                                    <KeyboardArrowLeftIcon style={{ color: 'white' }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='w-100 h-100'>
                        {!loading && filteredSortedRows.map(row => (
                            <Row
                                key={row.id}
                                row={row}
                                highlightedObjekt={highlightedObjekt}
                                tableLoc={tableLoc}
                                // types={types}
                                // layers={layers}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                // eslint-disable-next-line max-lines
                                onSelect={onSelect}
                                expandable={expandable}
                            />
                        ))}
                    </TableBody>
                </Table>
                {loading &&
                        <Loader />
                }
            </TableContainer>
        </>
    );
};

export default ObjectTable;
