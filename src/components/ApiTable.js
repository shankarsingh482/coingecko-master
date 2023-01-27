import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const ApiTable = ({
    columns,
    apiEndPoint,
    page = 1,
    perPage = 10,
    onRowClick,
    params = "",
    isCoinDetail = false,
    RowHeight,
    styleClass,
}) => {
    const [rows, setRows] = useState([]);
    // hook to validate request on or off...
    const [request, setRequest] = useState(false);
const getURL = (isCoinDetail)=>{
    if(isCoinDetail)
    {
        return  `https://api.coingecko.com/api/v3/coins/${params && params.id}`
    }
    else
    return `https://api.coingecko.com/api/v3/coins/${apiEndPoint ? apiEndPoint : ''}?${params}&per_page=${perPage}&page=${page}`
}
    // async await request to make API call using Axios
    async function makeApiCall() {
        setRequest(true);
        try {
            setRequest(true);
            const response =  await axios.get(
                getURL(isCoinDetail)
            );
            setRequest(false);
            if (response && !isCoinDetail)
                setRows(response.data);
            else if( response && isCoinDetail)
            {
                setRows([response.data]);
            }
            else
                setRows()
        } catch (error) {
            if (error.response) {
                //response status is an error code
                console.log(error.response.status);
            } else if (error.request) {
                //response not received though the request was sent
                console.log(error.request);
            } else {
                //an error occurred when setting up the request
                console.log(error.message);
            }
        }
    }

    // api call in useffect only if apiEndPoint is passed
    useEffect(() => {
            makeApiCall();
    },[]);

    return (
        <Box sx={{ height: "100vh", width: "100vw" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                loading={request}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
                disableSelectionOnClick
                onRowClick={(row) => {
                    if (onRowClick) onRowClick(row)
                }}
                experimentalFeatures={{ newEditingApi: true }}
                sx={styleClass}
                getRowHeight={()=>RowHeight}
            />
        </Box>
    );
};
export default ApiTable;