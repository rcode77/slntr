import React, { useState } from "react";
import ReactPaginate from "react-paginate";

// assets
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Table = ({ data, column, maxHeight, overflow = true }) => {
  return (
    <div
      className="flex flex-col max-h-[300px]"
      style={{
        maxHeight: maxHeight ? maxHeight : "300px",
      }}
    >
      <div
        className={`flex-grow rounded ${
          overflow ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        <table className="relative w-full table-auto shadow-lg">
          <thead>
            <tr className="">
              {column.map((column, columnIndex) => (
                <th
                  key={columnIndex}
                  className={`sticky bg-[#00AF50] font-medium text-left -top-0.5 py-2 text-black px-2`}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          {/* <tbody className={`divide-y text-black/80`}> */}
          <tbody className={`text-black`}>
            {data.map((item, dataIndex) => (
              <tr key={dataIndex}>
                {column.map((column, columnIndex) => (
                  <td key={columnIndex} className={`py-2 px-2 bg-[#EBFFE4]`}>
                    {column.selector(item, dataIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function TableCustom({ column, overflow = true, currentItems }) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden">
      <div
        className={`flex-grow ${
          overflow ? "overflow-auto" : "overflow-hidden"
        } shadow-lg`}
      >
        <table className="relative w-full border table-auto shadow-lg">
          <thead>
            <tr className="shadow-lg">
              {column.map((column, columnIndex) => (
                <th
                  key={columnIndex}
                  className="sticky text-left -top-0.5 py-2 text-black bg-[#00AF50] px-2"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y bg-white text-black/80">
            {currentItems &&
              currentItems.map((item, dataIndex) => (
                <tr key={dataIndex}>
                  {column.map((column, columnIndex) => (
                    <td key={columnIndex} className="py-2 px-2">
                      {column.selector(item, dataIndex)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TablePagination({ ItemsPerPage, items, column, currentPage }) {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + ItemsPerPage;
  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items?.length / ItemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * ItemsPerPage) % items?.length;
    setItemOffset(newOffset);
  };

  const showNextButton = currentPage !== pageCount - 1;
  const showPrevButton = currentPage !== 0;

  return (
    <>
      <TableCustom column={column} currentItems={currentItems} />
      <ReactPaginate
        breakLabel={<span className="mr-4">...</span>}
        nextLabel={
          showNextButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md">
              <BsChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          showPrevButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
              <BsChevronLeft />
            </span>
          ) : null
        }
        containerClassName="flex items-center justify-end my-2"
        pageClassName="block border-2 border-solid border-lightGray hover:bg-lightGray w-8 h-8 flex items-center justify-center text-sm rounded-md mr-4"
        activeClassName="bg-purple text-[#00AF50] border-2 border-solid border-[#00AF50]"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Table;
