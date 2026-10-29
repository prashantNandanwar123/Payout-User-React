import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";

// Number Pages Start
export const PagiPageCount = ({ pageCount, setStartOffset, itemsPerPage }) => {
  const pageChangeHandler = (e) => setStartOffset(e.selected * itemsPerPage)
  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageCount={pageCount}
      onPageChange={pageChangeHandler}
      pageRangeDisplayed={1}
      marginPagesDisplayed={1}
      containerClassName="pagination pagination-sm justify-content-end flex-wrap"
      pageClassName="page-item"
      pageLinkClassName="page-link themeclr2"
      nextClassName="page-item"
      nextLinkClassName="page-link shadow-none themeclr2"
      previousClassName="page-item"
      previousLinkClassName="page-link shadow-none themeclr2"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      activeLinkClassName="shadow-none"
    />
  )
}

// Search Method Start
export const PagiSearch = ({ setSearch, setStartOffset, totalEntries, setTableDataStatus }) => {

  const [changeVal, setChangeVal] = useState(0);

  useEffect(() => {
    if (totalEntries < 1) {
      setTableDataStatus('Not Found')
    }
  }, [changeVal])

  const searchHandler = (e) => {
    setSearch(e.target.value)
    setChangeVal(e.target.value)
    setStartOffset(0)
    e.target.closest('section').querySelector('.pagination').children[1].querySelector('a').click();
  }

  return (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-8 col-xl-9">
        <h6>TOTAL ENTRIES :- {totalEntries}</h6>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <input type="search" className="form-control form-control-sm shadow-none" placeholder="Search.." onChange={searchHandler} />
      </div>
    </div>
  )
}

// Acending or Decending Start
export const SortTableHeader = ({ text, dateName }) => {

  const dispatch = useDispatch();
  const {data} = useSelector(state => state.benefData);
  
  const changeHandler = (e) => {
    let icon = e.target.nextElementSibling;
    let sortData = () => {
      switch (dateName) {
        case 'Initiated':
          return data.sort(function (a, b) {
            let c = new Date(a.requestInitiateddate);
            let d = new Date(b.requestInitiateddate);
            if (e.target.checked) {
              icon.style.color = "white";
              return c - d;
            } else {
              icon.style.color = "#8f8f8f";
              return d - c;
            }
          })
        default:
          return data;
      }
    }
    let result = sortData();
    dispatch({type:'GET_BENEF_DATA',payload:result})
  }
  return (
    <label role="button">
      <input type="checkbox" className="d-none" onChange={changeHandler} />
      {text} <i className="bi bi-arrows-vertical ms-1" style={{ fontSize: '14px', color: '#8f8f8f' }}></i>
    </label>
  )
}
