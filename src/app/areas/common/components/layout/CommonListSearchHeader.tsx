/* eslint-disable */

import React, { useEffect, useState } from 'react'

import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig';
import { stringIsNullOrWhiteSpace } from '../../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { MenuComponent } from '../../../../../_sitecommon/assets/ts/components';
import { KTIcon } from '../../../../../_sitecommon/helpers';


type Props = {
    searchFields: HtmlSearchFieldConfig[];
    onSearch: any,
    onSearchReset: any
}

const CommonListSearchHeader: React.FC<Props> = ({ searchFields, onSearch, onSearchReset }) => {
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setSearchFieldValues(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSearchSubmit = (e: any) => {

        e.preventDefault();

        const updatedSearchFields = searchFields.map(field => ({
            ...field,
            defaultValue: searchFieldValues[field.inputName] || '',
        })).filter(field => !stringIsNullOrWhiteSpace(field.defaultValue));

        onSearch(updatedSearchFields);
    };



    useEffect(() => {
        MenuComponent.reinitialization()
    }, [])

    // Initialize searchValues with default values from searchFields
    useEffect(() => {
        const initialSearchValues: { [key: string]: string } = {};
        searchFields.forEach(field => {
            initialSearchValues[field.inputName] = field.defaultValue || '';
        });
        setSearchFieldValues(initialSearchValues);
    }, [searchFields]);


    const renderInputField = (field: HtmlSearchFieldConfig) => {
        switch (field.type) {
            case 'dropdown':
                return (
                    <>
                        <div className='d-flex align-items-center position-relative my-1'>
                            {/* <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' /> */}
                            {
                                field.icon
                                    ?
                                    field.icon
                                    :
                                    <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                            }

                            <select
                                className='form-select form-select-solid ps-14'
                                id={field.inputId} name={field.inputName}
                                onChange={handleSearchInputChange}
                                value={searchFieldValues[field.inputName] || ''}
                            >
                                {field.options?.map((option, optionIndex: any) => (
                                    <option key={optionIndex} value={option.value}>
                                        {option.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>

                );
            case 'text':
                return (
                    <div className='d-flex align-items-center position-relative my-1'>
                        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                        <input
                            type='text'
                            id={field.inputId}
                            name={field.inputName}
                            data-kt-user-table-filter='search'
                            className='form-control form-control-solid  ps-14'
                            placeholder={field.placeHolder}
                            value={searchFieldValues[field.inputName] || ''}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                );
            case 'search':
                return (
                    <div className='d-flex align-items-center position-relative my-1'>
                        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                        <input
                            type='search'
                            id={field.inputId}
                            name={field.inputName}
                            data-kt-user-table-filter='search'
                            className='form-control form-control-solid  ps-14'
                            placeholder={field.placeHolder}
                            value={searchFieldValues[field.inputName] || ''}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                );

            case 'number':
                return (
                    <div className='d-flex align-items-center position-relative my-1'>
                        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                        <input
                            type='number'
                            id={field.inputId}
                            name={field.inputName}
                            min={0}
                            data-kt-user-table-filter='search'
                            className='form-control form-control-solid  ps-14'
                            placeholder={field.placeHolder}
                            value={searchFieldValues[field.inputName] || ''}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                );

            case 'hidden':
                return (
                    <input
                        type='hidden'
                        id={field.inputId}
                        name={field.inputName}
                        min={0}
                        data-kt-user-table-filter='search'
                        className='form-control form-control-solid  ps-14'
                        placeholder={field.placeHolder}
                        value={searchFieldValues[field.inputName] || ''}
                        onChange={handleSearchInputChange}
                    />
                );

            case 'date':
                return (
                    <div className='d-flex align-items-center position-relative my-1'>
                        <KTIcon iconName='calendar-search' className='fs-1 position-absolute ms-6' />
                        <input
                            type='date'
                            id={field.inputId}
                            name={field.inputName}
                            data-kt-user-table-filter='date'
                            className='form-control form-control-solid  ps-14'
                            placeholder={field.placeHolder}
                            value={searchFieldValues[field.inputName] || ''}
                            onChange={handleSearchInputChange}
                        />
                        {!searchFieldValues[field.inputName] && <label htmlFor={field.inputId} className="placeholder-date-search">{field.placeHolder}</label>}
                    </div>
                );
            case 'checkbox':
                return (
                    <input
                        id={field.inputId}
                        name={field.inputName}
                        type="checkbox"
                        defaultChecked={field.defaultValue === 'true'} // Assuming defaultValue is a string 'true' or 'false'
                    />
                );
            default:
                return null;
        }
    };



    return (

        <>
            <div className='card-header border-0 pt-6'>




                <div className='card-title'>


                    <div className='row'>
                        {searchFields.map((field, index) => (

                            <div className={field.type == 'hidden' ? 'd-none' : (searchFields.length > 2 ? 'col-lg-4' : 'col-lg-6')} key={index} >
                                {renderInputField(field)}
                            </div>
                        ))}

                    </div>



                </div>
                {/* begin::Card toolbar */}
                <div className='card-toolbar'>
                    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>



                        {/* begin::Export */}
                        <button type='button' className='btn btn-light-primary me-3'
                            onClick={(e) => onSearchReset(e)}
                        >
                            <KTIcon iconName='exit-up' className='fs-2' />
                            Reset
                        </button>
                        {/* end::Export */}

                        {/* begin::Add user */}
                        <button type='button' className='btn btn-primary' onClick={(e) => handleSearchSubmit(e)}>
                            <KTIcon iconName='magnifier' className='fs-2' />
                            Search
                        </button>
                        {/* end::Add user */}
                    </div>
                </div>
                {/* end::Card toolbar */}
            </div>
        </>
    )
}

export default CommonListSearchHeader