import '../App.css';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {CSVLink} from "react-csv";
import * as Papa from "papaparse";
import ReactPaginate from "react-paginate";
import PaginatedItems from "./PaginatedItems";
import axios from "axios";
import {data} from "autoprefixer";



export default function Table2() {
    const [addNew, setAddNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const [newAssets, setNewAssets] = useState("");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState({key: "name", direction: "asc"});
    const [dir, setDir] = useState("asc");
    const [sortParam, setSortParam] = useState("");
    const [sortButton, setSortButton] = useState("CHOOSE SORT");
    const [dTD, setDTD] = useState([]);
    const [file, setFile] = useState();
    const inputRef = useRef();
    // const [data, setData] = useState(
    //     [
    //         {id: 1, name: "Elon Musk", assets: 273, age: 51},
    //         {id: 2, name: "Bernard Arnault", assets: 156, age: 73},
    //         {id: 3, name: "Gautam Adani", assets: 155, age: 60},
    //         {id: 4, name: "Jeff Bezos", assets: 149, age: 58},
    //         {id: 5, name: "Bill Gates", assets: 105, age: 66},
    //         {id: 6, name: "Larry Ellison", assets: 98, age: 78},
    //         {id: 7, name: "Warren Buffett", assets: 96, age: 92},
    //         {id: 8, name: "Mukesh Ambani", assets: 93, age: 65},
    //         {id: 9, name: "Larry Page", assets: 89, age: 49},
    //         {id: 10, name: "Sergey Brin", assets: 85, age: 49}
    //     ]
    // );
    const [data, setData] = useState(null);

    useEffect(() => {
        let url = "https://6323f387bb2321cba921746a.mockapi.io/billionaire";
        axios.get(url)
            .then(data => setData(data.data));
    },[]);
    const [persData, setPersData] = useState(null);
    useEffect(() => {
        let url = "https://6323f387bb2321cba921746a.mockapi.io/billionaire";
        axios.get(url)
            .then(data => setPersData(data.data));
    },[]);
    // const handleSearch = (e) => {
    //         setSearch(e.target.value);
    //         if (search.length >= 3) {
    //             const filterSearch = data.filter(
    //                 item => item.name.toLowerCase().includes(search)
    //             );
    //             setData(filterSearch);
    //             // setCurrentItems(filterSearch);
    //         }
    //     if (e.target.value.length == 0)
    //     {
    //         setData(persData);
    //     }
    // };
    const [searchData, setSearchData] = useState(null);
    useEffect(() => {
        let url = "https://6323f387bb2321cba921746a.mockapi.io/billionaire";
        axios.get(url + "?search=" + search)
            .then(data => setSearchData(data.data));
    },[search]);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (searchData != null) {
            setData(searchData);
        }
        if (e.target.value.length == 0) {
            setData(persData);
        }
    };
    const clearSearch = () => {
        setSearch("");
        setData(persData);
        // setCurrentItems(persData.slice(itemOffset,endOffset));
    };
    const handleAdd = () => {
        setData([...data,
            {
                id: data.length + 1, name: newName, assets: newAssets, age: newAge
            },
        ]);
        setAddNew(!addNew);
    };
    const showAdd = () => {
        setAddNew(!addNew);
    };
    const cancelAdd = () => {
        setAddNew(!addNew);
    };
    const handleChangeName = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let list = [...data];
        list[name] = value;
        setNewName(value)
    };

    const handleChangeAge = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let list = [...data];
        list[name] = value;
        setNewAge(value)
    };
    const handleChangeAssets = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let list = [...data];
        list[name] = value;
        setNewAssets(value);
    };

    const fR = new FileReader();
    const handleFileInput = () => {
        inputRef.current.click();
    };
    const handleFileSubmit = (e) => {
        setFile(e.target.files[0]);
    };

    const handleParse = () => {
        fR.onload = async ({target}) => {
            const csvOutput = Papa.parse(target.result,
                {
                    header: true,
                    transformHeader: function (h) {
                        return h.toLowerCase();
                    },
                    skipEmptyLines: true
                }
            );
            const parseData = csvOutput?.data;
            setData(parseData);
        };
        fR.readAsText(file);
    };
    if (file != null) {
        handleParse();
    }
    const ageOptions = () => {
        let arr = [];
        for (let i = 20; i < 101; i++) {
            arr.push(<option value={i}>{i}</option>)
        }
        return arr;
    };
    let sortedList = [];
    let perPage = 0;
    if (data != null) {
        sortedList = [...data];
        perPage = data.length;
    }
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        setItemOffset(newOffset);
    };
    const [itemOffset, setItemOffset] = useState(0);
    let endOffset = 5;


    const requestSort = key => {
        let direction = "asc";
        if (sortField && sortField.key === key && sortField.direction === "asc") {
            direction = "desc";
            setDir(sortField.direction)
        }
        setSortField({key, direction})
        setDir(sortField.direction);
        // if (sortField !== null) {
        //     sortedList.sort((a, b) => {
        //         if (a[sortField.key] < b[sortField.key]) {
        //             return sortField.direction === "asc" ? -1 : 1;
        //         }
        //         if (a[sortField.key] > b[sortField.key]) {
        //             return sortField.direction === "asc" ? 1 : -1;
        //         }
        //         return 0;
        //     });
        // }
        // changeSortButton(sortField.key)
        // sortedList = sortedList.slice(itemOffset,endOffset);
        // setData(sortedList);
        // setCurrentItems(sortedList)
    };
    useEffect(() => {
        if (sortField !== null) {
            sortedList.sort((a, b) => {
                if (a[sortField.key] < b[sortField.key]) {
                    return sortField.direction === "asc" ? -1 : 1;
                }
                if (a[sortField.key] > b[sortField.key]) {
                    return sortField.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        changeSortButton(sortField.key)
        sortedList = sortedList.slice(itemOffset,endOffset);
        setData(sortedList);
    },[sortField]);
    const getSortParam = (e) => {
        setSortParam(e);
        changeSortButton(e);
    };
    const changeSortButton = (e) => {
        let a = dir.toUpperCase();
        let b = e.toUpperCase();
        setSortButton(b + " - " + a);
    };
    const column = [
        {
            Header: "ID",
            accessor: "id"
        },
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Assets",
            accessor: "assets"
        },
        {
            Header: "Age",
            accessor: "age"
        }
    ];
    const download = () => {
        const toDL = data;
        let dataToDL = [];
        for (let i = 0; i < toDL.length; i++) {
            let recordToDL = {};
            for (let j = 0; j < column.length; j++) {
                recordToDL[column[j].Header] = toDL[i][column[j].accessor];
            }
            dataToDL.push(recordToDL);
        }
        setDTD(dataToDL);
    };
    return (
        <>
            <div className="grid gap-0 grid-cols-5">
                <div className={'text-center'}>
                    <input
                        className="mt-4 mb-4 rounded-l-md shadow appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="search" type="text" value={search} onChange={handleSearch}
                    />
                    <button className="bg-cyan-400 text-white font-bold py-2 px-4 rounded-none rounded-r-md mr-4"
                            onClick={clearSearch}>Clear
                    </button>
                </div>
                <div className={'text-center'}>
                    <select className="border mt-4 text-gray-900 text-sm rounded-lg py-2 px-4 bg-gray-50"
                            onChange={(e) => getSortParam(e.target.value)}>
                        <option value={"name"}>Sort By</option>
                        <option value={"id"}>ID</option>
                        <option value={"name"}>Name</option>
                        <option value={"assets"}>Assets</option>
                        <option value={"age"}>Age</option>
                    </select>
                    {sortParam != "" ? (
                        <button className="bg-lime-500 ml-3 text-white font-bold py-2 px-4 rounded"
                                onClick={() => requestSort(sortParam)}>
                            {sortButton}
                        </button>
                    ) : (
                        <button className="bg-lime-500 ml-3 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
                                disabled
                                onClick={() => requestSort(sortParam)}>
                            CHOOSE SORT
                        </button>
                    )}
                </div>
                <div className={'text-center'}>
                    <div>
                        {!addNew ? (
                            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 mt-4"
                                    onClick={showAdd}>Add
                                new</button>
                        ) : ("")}
                        {addNew ? (
                            <>
                                <div className={"grid grid-flow-row text-center items-center"}>
                                    <input
                                        className="mt-4 mb-4 w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="name" placeholder="Name" onChange={handleChangeName}/>
                                    <input
                                        className="shadow mr-4 mb-4 w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="assets" placeholder="Assets" onChange={handleChangeAssets}/>
                                    <select
                                        className=" border text-gray-900 mx-auto mb-4 w-2/4 items-center text-center text-sm rounded-lg py-2 px-4 bg-gray-50 "
                                        onChange={handleChangeAge}>
                                        <option selected>Select Age</option>
                                        {ageOptions()}
                                    </select>
                                    <button
                                        className="bg-blue-500 mb-4 w-2/4 mx-auto text-white font-bold py-2 px-4 rounded  "
                                        onClick={handleAdd}>Submit
                                    </button>
                                    <button
                                        className="bg-gray-500 mb-4 text-white w-2/4 mx-auto font-bold py-2 px-4 rounded "
                                        onClick={cancelAdd}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className={'text-center '}>
                    <div>
                        <label onClick={handleFileInput}
                               className={"bg-green-400 hover:cursor-pointer mt-4 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center"}>
                            <svg className="w-4 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            Import</label>
                        <input onChange={handleFileSubmit} ref={inputRef}
                               type={"file"} id={"getFile"} style={{color: "transparent", display: "none"}}/>
                    </div>
                    {/*<div>*/}
                    {/*    <button*/}
                    {/*        className={"bg-green-400 hover:cursor-pointer mt-4 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center"}*/}
                    {/*        onClick={handleParse}>*/}
                    {/*        Parse*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
                <div className={'text-center'}>
                    <div>
                        <CSVLink data={dTD} filename={"data.csv"}
                                 className="bg-green-400 mt-4 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                 onClick={download} target={"_blank"}>
                            <svg className="w-4 mr-2 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            <span>Export</span>
                        </CSVLink>
                    </div>
                </div>
            </div>
            <div>
                <select className="border mt-4 text-gray-900 text-sm rounded-lg py-2 px-4 bg-gray-100 mb-4"
                        onChange={(e) => setItemsPerPage(e.target.value)}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
            <div className="overflow-x-hidden overflow-y-auto relative">
                <table className="w-full text-sm text-left table-fixed text-center">
                    <thead className="text-xs uppercase border">
                    <tr>
                        <th scope="col" className="py-3 px-6 w-5">
                            #
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Assets
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Age
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data != null ? (
                        <PaginatedItems itemsPerPage={itemsPerPage} data={data} itemOffSet={itemOffset} stateChanger={setData}/>
                    ):(
                        "Loading"
                    )}
                    </tbody>
                </table>
                <div className={'mx-auto text-center items-center mt-4'}>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next"
                        nextLinkClassName={"block py-2 px-3 leading-tight text-black rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        className={"inline-flex items-center mx-auto"}
                        pageClassName={"py-2 px-3 leading-tight text-black bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"}
                        pageCount={Math.ceil(perPage / itemsPerPage)}
                        previousLabel="Previous"
                        previousLinkClassName={"block py-2 px-3 ml-0 leading-tight text-black bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"}
                        renderOnZeroPageCount={null}
                    />
                </div>

            </div>
            <form>
                <input type={"text"}/>
            </form>
        </>
    );
};