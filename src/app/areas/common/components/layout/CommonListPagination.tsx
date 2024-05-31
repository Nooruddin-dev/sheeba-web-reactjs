import clsx from 'clsx';
import React from 'react'

type Props = {
    pageNo: number,
    pageSize: number,
    totalRecords: number,
    goToPage: any
}

const CommonListPagination: React.FC<Props> = ({ pageNo, pageSize, totalRecords, goToPage }) => {

    const isLoading = false;

    const totalPages = Math.ceil(totalRecords / pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handleGoToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            goToPage(page);
        }
    };


    return (
        <>

            {/* <div className="pagination">
                {pageNo > 1 && <button onClick={() => handleGoToPage(1)}>First</button>}
                {pageNo > 1 && <button onClick={() => handleGoToPage(pageNo - 1)}>Prev</button>}
                {getPageNumbers().map((page) => (
                    <button key={page} onClick={() => handleGoToPage(page)}>{page}</button>
                ))}
                {pageNo < totalPages && <button onClick={() => handleGoToPage(pageNo + 1)}>Next</button>}
                {pageNo < totalPages && <button onClick={() => handleGoToPage(totalPages)}>Last</button>}
            </div> */}

            <div className='row'>
                <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
                <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                    <div id='kt_table_users_paginate'>
                        <ul className='pagination'>


                            {
                                pageNo > 1
                                    ?
                                    <li
                                        className={clsx('page-item', {
                                            disabled: false,
                                        })}
                                    >
                                        <a style={{ cursor: 'pointer' }} className='page-link' onClick={() => handleGoToPage(1)}>
                                            First
                                        </a>

                                    </li>
                                    :
                                    <></>
                            }

                            {
                                pageNo > 1
                                    ?
                                    <li
                                        className={clsx('page-item', {
                                            disabled: false,
                                            previous: true,
                                        })}
                                    >
                                        <a style={{ cursor: 'pointer' }} className='page-link' onClick={() => handleGoToPage(pageNo - 1)}>
                                            Previous
                                        </a>

                                    </li>
                                    :
                                    <>
                                    </>
                            }


                            {getPageNumbers().map((page) => (
                                // <button key={page} onClick={() => handleGoToPage(page)}>{page}</button>
                                <li key={page}

                                    className={clsx('page-item', {
                                        active: pageNo === page,
                                        disabled: false,
                                        previous: false,
                                        next: false,
                                    })}
                                >
                                    <a
                                        className={clsx('page-link', { 'page-text': false, 'me-5': false, })}
                                        onClick={() => handleGoToPage(page)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {page}
                                    </a>
                                </li>
                            ))}


                            {
                                pageNo < totalPages
                                    ?
                                    <li className={clsx('page-item', { disabled: false, next: true })} >
                                        <a className={clsx('page-link', { 'page-text': TextTrackCueList, 'me-5': false, })}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleGoToPage(pageNo + 1)}
                                        >
                                            Next
                                        </a>
                                    </li>
                                    :
                                    <></>
                            }


                            {
                                pageNo < totalPages
                                    ?
                                    <li
                                        className={clsx('page-item', {
                                            disabled: false
                                        })}
                                    >
                                       <a style={{ cursor: 'pointer' }} className='page-link' onClick={() => handleGoToPage(totalPages)}>Last</a>

                                    </li>
                                    :
                                    <></>
                            }


                        </ul>
                    </div>
                </div>
            </div>
        </>

    )
}
export default CommonListPagination;