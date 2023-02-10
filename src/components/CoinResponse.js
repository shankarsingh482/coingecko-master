import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";
import { CustomPagination, StyledDataGrid } from "./TableStyle";

const CoinResponse = ({
  columns,
  apiEndPoint,
  page = 1,
  perPage = 10,
  onRowClick,
  params = "",
  isCoinDetail = false,
  RowHeight,
  styleClass,
  density = "standard",
}) => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  // hook to validate request on or off...
  const [request, setRequest] = useState(false);

  const getURL = (isCoinDetail) => {
    if (isCoinDetail) {
      return `https://api.coingecko.com/api/v3/coins/${params && params.id}`;
    } else
      return `https://api.coingecko.com/api/v3/coins/${
        apiEndPoint ? apiEndPoint : ""
      }?${params}&per_page=${perPage}&page=${page}`;
  };
  // async await request to make API call using Axios
  async function makeApiCall() {
    setRequest(true);
    try {
      setRequest(true);
      const response = await axios.get(getURL(isCoinDetail));
      setRequest(false);
      if (response && !isCoinDetail) setRows(response.data);
      else if (response && isCoinDetail) {
        setRows([response.data]);
      }
    } catch (error) {
      setRequest(false);
      setError("Something is broken Please check after some time  !!!!");
      throw new Error("Something is broken Please check after some time");
    }
  }

  useEffect(() => {
    makeApiCall();
  }, []);

  return (
    <Box>
      <ErrorBoundary>
        <StyledDataGrid
          density={density}
          rows={rows}
          error={error}
          columns={columns}
          pageSize={10}
          loading={request}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
          onRowClick={(row) => {
            if (onRowClick) onRowClick(row);
          }}
          experimentalFeatures={{ newEditingApi: true }}
          sx={styleClass}
          getRowHeight={() => RowHeight}
          components={{
            Pagination: CustomPagination,
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </ErrorBoundary>
    </Box>
  );
};

CoinResponse.propTypes = {
  columns: PropTypes.array,
  apiEndPoint: PropTypes.string,
  page: PropTypes.number,
  perPage: PropTypes.number,
  onRowClick: PropTypes.func,
  params: PropTypes.string,
  isCoinDetail: PropTypes.bool,
  RowHeight: PropTypes.string,
  styleClass: PropTypes.object,
  density: PropTypes.string,
};

export default CoinResponse;
