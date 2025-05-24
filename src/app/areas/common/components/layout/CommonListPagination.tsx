import clsx from 'clsx';
import React from 'react'

const CommonListPagination: React.FC<{
    pageNo: number,
    pageSize: number,
    totalRecords: number,
    goToPage: any
}> = ({ pageNo, pageSize, totalRecords, goToPage }) => {
    const totalPages = Math.ceil(totalRecords / pageSize);

    const getPageNumbers = () => {
        const pages = [];
        const pageGroupSize = 10; // Show 10 pages at a time
        const currentGroup = Math.floor((pageNo - 1) / pageGroupSize);
        const startPage = currentGroup * pageGroupSize + 1;
        const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
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
        <div className='row'>
            <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
            <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
                <div id='kt_table_users_paginate'>
                    <ul className='pagination'>
                        {/* First button */}
                        {pageNo > 1 && (
                            <li className={clsx('page-item')}>
                                <button
                                    type="button"
                                    style={{ cursor: 'pointer' }}
                                    className='page-link'
                                    onClick={() => handleGoToPage(1)}>
                                    First
                                </button>
                            </li>
                        )}

                        {/* Previous button */}
                        {pageNo > 1 && (
                            <li className={clsx('page-item', { previous: true })}>
                                <button
                                    type="button"
                                    style={{ cursor: 'pointer' }}
                                    className='page-link'
                                    onClick={() => handleGoToPage(pageNo - 1)} >
                                    Previous
                                </button>
                            </li>
                        )}

                        {/* Previous page group indicator */}
                        {pageNo > 10 && (
                            <li className={clsx('page-item')}>
                                <button
                                    type="button"
                                    className='page-link'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleGoToPage(Math.floor((pageNo - 1) / 10) * 10)}>
                                    ...
                                </button>
                            </li>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers().map((page) => (
                            <li
                                key={page}
                                className={clsx('page-item', {
                                    active: pageNo === page,
                                })}>
                                <button
                                    type="button"
                                    className='page-link'
                                    onClick={() => handleGoToPage(page)}
                                    style={{ cursor: 'pointer' }}>
                                    {page}
                                </button>
                            </li>
                        ))}

                        {/* Next button */}
                        {pageNo < totalPages && (
                            <li className={clsx('page-item', { next: true })}>
                                <button
                                    type="button"
                                    className='page-link'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleGoToPage(pageNo + 1)}>
                                    Next
                                </button>
                            </li>
                        )}

                        {/* Last button */}
                        {pageNo < totalPages && (
                            <li className={clsx('page-item')}>
                                <button
                                    type="button"
                                    style={{ cursor: 'pointer' }}
                                    className='page-link'
                                    onClick={() => handleGoToPage(totalPages)}>
                                    Last
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default CommonListPagination;