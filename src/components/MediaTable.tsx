import * as React from 'react';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Input,
} from 'reactstrap';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    MediaFile,
} from '../models/MediaFile';
import {
    useState, useEffect, useRef,
} from 'react';
import FileUploader from './FileUploader';


function Row(props: {
        row: MediaFile,
        onDelete: (id: number) => void,
        onPlay: (id: number) => void,
    }) {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        row, onDelete, onPlay,
    } = props;

    const rowLoc = useRef<HTMLTableRowElement>(null);
    const deleteLoc = useRef<HTMLButtonElement>(null);

    return (
        <React.Fragment>
            <TableRow
                hover
                sx={{ '& > *': { borderBottom: 'unset' } }}
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
                <TableCell
                    component="th"
                    scope="row"
                    align="left"
                >
                    {row.path}
                </TableCell>
                <TableCell align="center">
                    <Button
                        onClick={()=>onPlay(row.id)}
                        variant="outlined"
                        color="success"
                        className='m-1'
                    >
                        Play
                    </Button>
                    <Button
                        onClick={()=>onDelete(row.id)}
                        variant="outlined"
                        color="error"
                        className='m-1'
                        ref={deleteLoc}
                    >
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface Props {
    rows?: Array<MediaFile>
    onDelete: (id: number) => void
    onPlay: (id: number) => void
    onUpload: (file: File) => void
}

const MediaTable = ({
    rows,
    onDelete,
    onPlay,
    onUpload,
}: Props) => {
    const [
        filteredRows,
        setFilteredRows,
    ] = useState<Array<MediaFile>>([]);

    const [
        filteredSortedRows,
        setFilteredSortedRows,
    ] = useState<Array<MediaFile>>([]);

    const [
        sortAttr,
        setSortAttr,
    ] = useState<string>('id');

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
        pathFilter,
        setPathFilter,
    ] = useState<string>('');

    useEffect(() => {
        if(!rows) {
            return;
        };
        let r = rows;
        if(idFilter) {
            r = r.filter(row => row.id == idFilter);
        }
        if(nameFilter){
            r = r.filter(row => row.name.toLowerCase().includes(nameFilter.toLowerCase()));
        }
        if(pathFilter) {
            r = r.filter(row => row.path == pathFilter);
        }
        setFilteredRows([ ...r ]);
    }, [
        rows,
        idFilter,
        nameFilter,
        pathFilter,
        sortAttr,
        reverseSort,
    ]);

    const tableLoc = useRef<HTMLTableElement>(null);

    useEffect(() => {
        setFilteredSortedRows([ ...filteredRows.sort(sortingFunc) ]);
    }, [
        filteredRows,
        sortAttr,
        reverseSort,
    ]);

    const setSortingAttribute = (attr: string) => {
        if(attr == sortAttr){
            setReverseSort(current => !current);
        } else {
            setReverseSort(false);
            setSortAttr(attr);
        }
    };

    const sortingFunc = (a: MediaFile, b: MediaFile) => {
        const firstName = a.name.toUpperCase();
        const secondName = b.name.toUpperCase();
        const firstPath = a.path.toUpperCase();
        const secondPath = b.path.toUpperCase();
        switch(sortAttr){
            case 'id':
                return reverseSort ? b.id - a.id : a.id - b.id;
            case 'name':
                if (firstName < secondName) {
                    return reverseSort ? 1 : -1;
                }
                if (secondName < firstName) {
                    return reverseSort ? -1 : 1;
                }
                return 0;
            case 'path':
                if (firstPath < secondPath) {
                    return reverseSort ? 1 : -1;
                }
                if (secondPath < firstPath) {
                    return reverseSort ? -1 : 1;
                }
                return 0;
            default:
                return 0;
        }
    };

    return(
        <TableContainer
            component={Paper}
            sx={{ maxHeight: 500 }}
            ref={tableLoc}
        >
            <Table
                stickyHeader={true}
            >
                <colgroup>
                    <col style={{ width:'10%' }}/>
                    <col style={{ width:'20%' }} />
                    <col/>
                    <col style={{ width:'20%' }}/>
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
                                    setSortingAttribute('id');
                                }}
                                style={{ minHeight: '26px' }}
                            ><div className='col'>Id {sortAttr == 'id' ? (reverseSort ? <KeyboardArrowUpIcon style={{ textAlign: 'right' }} /> : <KeyboardArrowDownIcon />) : ''}</div>
                            </div>
                            <Input
                                type="number"
                                name="id"
                                id="id"
                                placeholder="Id"
                                pattern="[0-9]+"
                                min={rows ? Math.min(...rows.map(r => r.id)) : 0}
                                max={rows ? Math.max(...rows.map(r => r.id)) : ''}
                                onChange={event => {
                                    if(event.target.value === '0'){
                                        setIdFilter(null);
                                        event.target.value = '';
                                        return;
                                    }
                                    setIdFilter(parseInt(event.target.value));
                                }}
                            /></TableCell>
                        <TableCell align="left">
                            <div
                                className='sorter row'
                                onClick={()=>{
                                    setSortingAttribute('name');
                                }}
                                style={{ minHeight: '26px' }}
                            ><div className='col-sm-10'>Name {sortAttr == 'name' ? (reverseSort ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : ''}</div>
                            </div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name"
                                onChange={event => setNameFilter(event.target.value)}
                            />
                        </TableCell>
                        <TableCell align="left">
                            <div
                                className='sorter row'
                                onClick={()=>{
                                    setSortingAttribute('path');
                                }}
                                style={{ minHeight: '26px' }}
                            ><div className='col-sm-10'>Path {sortAttr == 'path' ? (reverseSort ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : ''}</div>
                            </div>
                            <Input
                                type="text"
                                name="path"
                                id="path"
                                placeholder="Path"
                                onChange={event => setPathFilter(event.target.value)}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <FileUploader handleFileUpload={onUpload} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredSortedRows.map(row => (
                        <Row
                            key={row.id}
                            row={row}
                            onDelete={onDelete}
                            onPlay={onPlay}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MediaTable;
