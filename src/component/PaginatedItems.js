import React, {useEffect, useRef, useState} from "react";
import ReactPaginate from "react-paginate";

export default function PaginatedItems({itemsPerPage, data, itemOffSet, stateChanger}) {
    const [currentItems, setCurrentItems] = useState(data);
    const [persData] = useState(data);
    const [itemOffset, setItemOffset] = useState(0);
    const [rowEdit, setRowEdit] = useState();
    const [rowDel, setRowDel] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [edit, setEdit] = useState(false);
    let endOffset = 5;
    const handleConfirm = (e) => {
        setRowDel(e)
        setConfirm(true);
    };
    useEffect(() => {
        setItemOffset(itemOffSet);
    }, [itemOffSet]);
    useEffect(() => {
        setCurrentItems(data.slice(itemOffset, endOffset))
    }, [data]);
    const handleDelete = (e) => {
        setConfirm(true);
        let list = [...persData];
        list = list.filter((item) => {
            return item.id != e;
        });
        stateChanger(list);
        setCurrentItems(list.slice(itemOffset, endOffset));
        setConfirm(false);
    };
    const handleNo = () => {
        setConfirm(false);
    };
    const handleEdit = (e) => {
        setRowEdit(e);
        setEdit(!edit);
    };
    const handleCancel = () => {
        setEdit(!edit);
    };
    const handleSave = () => {
        setEdit(!edit);
        let save = [...currentItems];
        if (save[rowEdit - 1]["id"] == list[0]["id"]) {
            if (list[0]["name"] != "") {
                save[rowEdit - 1]["name"] = list[0]["name"];
            }
            console.log(list[0]["asset"])
            if (list[0]["asset"] != "") {
                save[rowEdit - 1]["assets"] = list[0]["asset"];
            }
            if (list[0]["age"] != "") {
                save[rowEdit - 1]["age"] = list[0]["age"];
            }
        }
        list.length = 0;
        setCurrentItems(save);
    };
    // const handleChange = (e, index) => {
    //     const {name, value} = e.target;
    //     const list = [...currentItems];
    //     // list[index][name] = value;
    //     list[rowEdit-1][name] = value
    //     // list.slice(itemOffset, endOffset);
    //     // setCurrentItems(list.slice(itemOffset,endOffset));
    // };
    let list = [{
        id: "",
        name: "",
        asset: "",
        age: ""
    }]
    const handleChange = (e, i) => {
        const {name, value} = e.target;
        list[0]["id"] = rowEdit;
        switch (name) {
            case ("name"):
                list[0]["name"] = value;
                break;
            case ("assets"):
                list[0]["asset"] = value;
                break;
            case ("age"):
                list[0]["age"] = value;
                break;
        }
    };
    // const inputRef2 = useRef(null);
    // const inputRef3 = useRef(null);
    // const inputRef4 = useRef(null);
    useEffect(() => {
        // const endOffset = itemOffset + itemsPerPage;
        endOffset = itemOffset + itemsPerPage;
        setCurrentItems(data.slice(itemOffset, endOffset));
    }, [itemOffset, itemsPerPage]);
    return (
        <>
            {currentItems.map((item, key) => {
                return (
                    <>
                        {!edit ? (
                            <tr className="bg-white border-b">
                                <td scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {item.id}
                                </td>
                                <td scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {item.name}
                                </td>
                                <td scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {item.assets} Billion USD
                                </td>
                                <td scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {item.age}
                                </td>
                                <td scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap w-10">
                                    <button className="bg-amber-400 py-2 px-4 text-white rounded"
                                            onClick={() => handleEdit(item.id)}>Edit
                                    </button>
                                    <button className="bg-red-500 py-2 px-4 text-white rounded ml-4"
                                            onClick={() => handleConfirm(item.id)}>Delete
                                    </button>
                                </td>
                                {confirm ? (
                                    <div className="fixed z-50 w-full md:inset-0 h-modal md:h-full">
                                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto mx-auto">
                                            <div className="relative bg-white rounded-lg shadow ">
                                                <div
                                                    className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                                        Confirmation
                                                    </h3>
                                                    <button type="button"
                                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                            onClick={handleNo}>
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor"
                                                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd"
                                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                  clipRule="evenodd"></path>
                                                        </svg>
                                                        <span className="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    <h1 className="text-2xl text-red-600">Are you sure you want to
                                                        delete?</h1>
                                                </div>
                                                <div
                                                    className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                                    <button data-modal-toggle="defaultModal" type="button"
                                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={() => handleDelete(rowDel)}>Yes
                                                    </button>
                                                    <button data-modal-toggle="defaultModal" type="button"
                                                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                            onClick={handleNo}>No
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ("")}
                            </tr>
                        ) : (
                            <>
                                {rowEdit == item.id ? (
                                    <tr className="bg-white border-b">
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.id}
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            <input
                                                // ref={inputRef2} autoFocus={inputRef2.current === document.activeElement}
                                                className="shadow text-center appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                name="name" placeholder={item.name}
                                                onChange={(e) => handleChange(e, key)}/>
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            <input
                                                // ref={inputRef3} autoFocus={inputRef3.current === document.activeElement}
                                                className="shadow text-center appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                name="assets" placeholder={item.assets}
                                                onChange={(e) => handleChange(e, key)}/>
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            <input
                                                // ref={inputRef4} autoFocus={inputRef4.current === document.activeElement}
                                                className="shadow text-center appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                name="age" placeholder={item.age}
                                                onChange={(e) => handleChange(e)}/>
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            <button className="bg-green-400 py-2 px-4 text-white rounded"
                                                    onClick={handleSave}>Save
                                            </button>
                                            <button
                                                className="bg-transparent border border-black ml-2 py-2 px-4 text-gray-800 rounded"
                                                onClick={handleCancel}>Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr className="bg-white border-b">
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.id}
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.name}
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.assets} Billion USD
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.age}
                                        </td>
                                        <td scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap w-10">
                                            <button
                                                className="bg-amber-400 py-2 px-4 text-white rounded disabled:grayscale"
                                                disabled
                                                onClick={() => handleEdit(item.id)}>Edit
                                            </button>
                                            <button
                                                className="bg-red-500 py-2 px-4 text-white rounded ml-4 disabled:grayscale"
                                                disabled
                                                onClick={() => handleConfirm(item.id)}>Delete
                                            </button>
                                        </td>
                                        {confirm ? (
                                            <div className="fixed z-50 w-full md:inset-0 h-modal md:h-full">
                                                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto mx-auto">
                                                    <div className="relative bg-white rounded-lg shadow ">
                                                        <div
                                                            className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                                                            <h3 className="text-xl font-semibold text-gray-900 ">
                                                                Confirmation
                                                            </h3>
                                                            <button type="button"
                                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    onClick={handleNo}>
                                                                <svg aria-hidden="true" className="w-5 h-5"
                                                                     fill="currentColor"
                                                                     viewBox="0 0 20 20"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd"
                                                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                          clipRule="evenodd"></path>
                                                                </svg>
                                                                <span className="sr-only">Close modal</span>
                                                            </button>
                                                        </div>
                                                        <div className="p-6 space-y-6">
                                                            <h1 className="text-2xl text-red-600">Are you sure you want
                                                                to
                                                                delete?</h1>
                                                        </div>
                                                        <div
                                                            className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                                            <button data-modal-toggle="defaultModal" type="button"
                                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                    onClick={() => handleDelete(rowDel)}>Yes
                                                            </button>
                                                            <button data-modal-toggle="defaultModal" type="button"
                                                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                                    onClick={handleNo}>No
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : ("")}
                                    </tr>
                                )}
                            </>
                        )}
                    </>
                )
            })}
        </>
    );
}