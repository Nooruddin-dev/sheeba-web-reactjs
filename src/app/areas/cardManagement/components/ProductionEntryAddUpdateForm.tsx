/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Controller, useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import ReactSelect from 'react-select';
import { gerProductionEntryListBySearchTermApi, getAllProductsForProductionEntryApi, getJobCardDetailByIdForEditApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppendDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { MachineTypesEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { convertToTwoDecimalFloat } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';

interface ProductionEntryAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any,
    allMachinesList: any

}

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
    }),
    // input: (provided: any) => ({

};




const ProductionEntryAddUpdateForm: React.FC<ProductionEntryAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,
    allMachinesList

}) => {

    const { control, register, watch, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);

    const [cartAllProducts, setCartAllProducts] = useState<any>(null);

    const [selectedProductionEntryDropDown, setSelectedProductionEntryDropDown] = useState<any>(null);
    const [selectedSearchProductionEntryOptions, setSelectedSearchProductionEntryOptions] = useState([]);
    const [searchQueryProductionEntry, setSearchQueryProductionEntry] = useState('');
    const [selectedProductOption, setSelectedProductOption] = useState<any>(null);
    const [productOptions, setProductOptions] = useState<any>([]);

    const handleProductChange = (option: any) => {
        setSelectedProductOption(option);
    };

    try {
        const wasteValue = watch("waste_value") || 0;
        const gross_value = watch("gross_value") || 0;
        const tare_core = watch("tare_core") || 0;



        const netTotalValue = convertToTwoDecimalFloat(gross_value) - convertToTwoDecimalFloat(wasteValue) - convertToTwoDecimalFloat(tare_core);
        setValue("net_value", convertToTwoDecimalFloat(netTotalValue));

    } catch (error) {
        console.error("An error occured in calculating total net value: ", error);
    }




    const onSubmitProductEntryForm = (data: any) => {
        const formData = { ...data };
        
        if (isMaterialFieldEnabled() == true) {
            if ((selectedProductOption == undefined || selectedProductOption == null)) {
                showErrorMsg("Please select valid product/material");
                return false;
            }
        } else {
            formData.job_card_product_id = null;
        }


        if (isMaterialFieldEnabled() == true && (selectedProductOption == undefined || selectedProductOption == null)) {
            showErrorMsg('Please select valid product/material');
            return false;
        }

        formData.job_card_product_id = selectedProductOption?.value;



        onSubmit(formData);

        //onSubmit(data);
        // reset(); // Clear the form after submission
    };

    const handleSelectProductionEntryDropDown = (selectedOption: any) => {
        // Set the selected customer state

        setSelectedProductionEntryDropDown(null);

        const job_card_id_selected = selectedOption?.value;


        getJobCardDetailByIdForEditApi(job_card_id_selected)

            .then((res: any) => {
                const { data } = res;

                if (data) {
                    setValue('job_card_id', data.job_card_id);
                    setValue('job_card_no', data.job_card_no);
                    setValue('company_name', data.company_name);
                    setValue('product_name', data.product_name);
                    setValue('weight_qty', data.weight_qty);

                    //setValue('weight_value', data.weight_value);






                }


            })
            .catch((err: any) => console.log(err, "err"));


    };


    const isMaterialFieldEnabled = () => {

        const machineId = watch("machine_id");
        const machine_type_id = allMachinesList?.find((x: { machine_id: string; }) => x.machine_id == machineId)?.machine_type_id;
        if (machine_type_id == MachineTypesEnum.Printing || machine_type_id == MachineTypesEnum.Lamination || machine_type_id == MachineTypesEnum.Extruder) {
            return true;
        } else {
            return false;
        }

    }



    useEffect(() => {
        if (defaultValues && defaultValues.production_entry_idEditForm && defaultValues.production_entry_idEditForm > 0) {
            setIsEditCase(true);

            const selectedOption = {
                value: defaultValues?.job_card_id
            }
            handleSelectProductionEntryDropDown(selectedOption);

            // setValue('weight_qty', defaultValues.weight_qty);
        }


    }, [])


    // Fetch options when the search query changes
    useEffect(() => {
        if (searchQueryProductionEntry && stringIsNullOrWhiteSpace(searchQueryProductionEntry) == false) {
            gerProductionEntryListBySearchTermService();
        } else {
            setSelectedSearchProductionEntryOptions([]); // Clear options if search query is empty
        }
    }, [searchQueryProductionEntry]);






    const gerProductionEntryListBySearchTermService = () => {
        gerProductionEntryListBySearchTermApi(searchQueryProductionEntry)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    const prodEntryOptions = res?.data?.map((prodEntry: any) => ({
                        value: prodEntry.job_card_id,
                        label: `${prodEntry.job_card_no}`
                    }));
                    setSelectedSearchProductionEntryOptions(prodEntryOptions);
                } else {
                    setSelectedSearchProductionEntryOptions([]);
                }

            }).catch((error: any) => {
                console.error('Error fetching job card data:', error);
            });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                getAllProductsForProductionEntryApi()
                    .then((res: any) => {
                        const { data } = res;
                        if (data) {

                            setCartAllProducts(data);

                            const productOptionsLocal = data?.map((product: any) => ({
                                value: product.productid,
                                label: product.sku + ' -- ' + product.product_name,
                            }));
                            setProductOptions(productOptionsLocal);

                            if ((defaultValues && defaultValues.production_entry_idEditForm && defaultValues.production_entry_idEditForm > 0)) {
                                const selectedProdLocal = productOptionsLocal?.find((x: { value: any; }) => x.value == defaultValues?.job_card_product_id);
                                setSelectedProductOption(selectedProdLocal);
                            }
                        }


                    })
                    .catch((err: any) => console.log(err, "err"));

            } catch (error) {
                console.error("Error fetching products:", error);

            }
        };

        fetchProducts();
    }, []);





    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-large-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>
                        {isEditCase ? 'Update Production Entry' : 'Create Production Entry'}
                    </h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitProductEntryForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                        <div className='row'>


                            <input type='hidden' id="production_entry_idEditForm" {...register("production_entry_idEditForm", { required: false })} />
                            <input type='hidden' id="job_card_id" {...register("job_card_id", { required: false })} />

                            <div className='col-lg-4'>

                                <div className="mb-10">
                                    <label className="form-label  ">Job Card ID (Readonly)</label>
                                    {
                                        defaultValues?.production_entry_idEditForm > 0
                                            ?
                                            <>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid `}
                                                    readOnly={true}
                                                    placeholder=""
                                                    value={defaultValues?.production_entry_idEditForm}
                                                />
                                            </>
                                            :

                                            <ReactSelect
                                                isMulti={false}
                                                isClearable={true}
                                                placeholder="Search Job Card"
                                                className="flex-grow-1"
                                                styles={customStyles}
                                                value={selectedProductionEntryDropDown}
                                                onChange={handleSelectProductionEntryDropDown}
                                                options={selectedSearchProductionEntryOptions}
                                                onInputChange={setSearchQueryProductionEntry}
                                            />
                                    }



                                </div>
                            </div>



                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Job Card No (Readonly)</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid `}
                                        id="job_card_no" {...register("job_card_no", { required: false })}
                                        readOnly={true}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Company Name (Readonly)</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid `}
                                        id="company_name" {...register("company_name", { required: false })}
                                        readOnly={true}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Product Name (Readonly)</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid `}
                                        id="product_name" {...register("product_name", { required: false })}
                                        readOnly={true}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Weight/Quantity (Readonly)</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid `}
                                        id="weight_qty" {...register("weight_qty", { required: false })}
                                        readOnly={true}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Machine </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.machine_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="machine_id" {...register("machine_id", { required: true })}
                                    // disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {allMachinesList?.map((item: any, index: any) => (
                                            <option key={index} value={item.machine_id}>
                                                {item.machine_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.machine_id && <SiteErrorMessage errorMsg='Machine is required' />}
                                </div>
                            </div>


                            <div className='col-lg-4' style={{ display: isMaterialFieldEnabled() == true ? 'block' : 'none' }}>
                                <div className="mb-10">
                                    <label className="form-label">Material </label>
                                    {/* <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.job_card_product_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="job_card_product_id" {...register("job_card_product_id", { required: false })}
                                    // disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {cartAllProducts?.map((item: any, index: any) => (
                                            <option key={index} value={item.job_card_product_id}>
                                                {item.sku} - {item.product_name}
                                            </option>
                                        ))}
                                    </select> */}
                                    {errors.job_card_product_id && <SiteErrorMessage errorMsg='Material is required' />}

                                    {/* <Controller
                                        name="job_card_product_id"
                                        control={control}
                                        render={({ field }) => (
                                            <ReactSelect
                                                {...field}
                                                options={productOptions}
                                                isSearchable
                                                placeholder="Select a product..."

                                            />
                                        )}
                                    /> */}

                                    <ReactSelect
                                        inputId="flavor-select"  // Associates an ID with the input field
                                        value={selectedProductOption}
                                        onChange={handleProductChange}
                                        options={productOptions}
                                        placeholder="Select a flavor"
                                    />


                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="any" 
                                        className={`form-control form-control-solid `}
                                        id="weight_value" {...register("weight_value", { required: false })}
                                        readOnly={false}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Start Time</label>
                                    <input
                                        type="time"
                                        className={`form-control form-control-solid`}
                                        id="start_time"
                                        {...register("start_time", { required: false })}
                                        readOnly={false}
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="time"
                                        className={`form-control form-control-solid`}
                                        id="end_time"
                                        {...register("end_time", { required: false })}
                                        readOnly={false}
                                        placeholder=""
                                    />
                                </div>
                            </div>






                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">Gross</label>
                                    <input
                                        type="number"
                                        step="any" 
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.gross_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="gross_value" {...register("gross_value", { required: false })}
                                        readOnly={false}
                                        placeholder=""
                                    />

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label  required">Waste</label>
                                    <input
                                        type="number"
                                        step="any" 
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.waste_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="waste_value" {...register("waste_value", { required: true })}
                                        readOnly={false}
                                        placeholder="Enter waste"
                                    />
                                    {errors.waste_value && <SiteErrorMessage errorMsg='Waste is required' />}
                                </div>
                            </div>


                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label  required">Tare/Core</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="any" 
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.tare_core ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="tare_core" {...register("tare_core", { required: false })}
                                        readOnly={false}
                                        placeholder="Enter tare/core"
                                    />
                                    {errors.tare_core && <SiteErrorMessage errorMsg='Tare/Core is required' />}
                                </div>
                            </div>


                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label  required">Net</label>
                                    <input
                                        type="number"
                                        step="any" 
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.net_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="net_value" {...register("net_value", { required: true })}
                                        readOnly={true}
                                        placeholder="Enter net value"
                                    />
                                    {errors.net_value && <SiteErrorMessage errorMsg='Net is required' />}
                                </div>
                            </div>












                            {/* <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Unit </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.unit_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="unit_id" {...register("unit_id", { required: true })}
                                        disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {allUnitsList?.map((item: any, index: any) => (
                                            <option key={index} value={item.unit_id}>
                                                {item.unit_short_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unit_id && <SiteErrorMessage errorMsg='Unit is required' />}
                                </div>
                            </div> */}





                        </div>

                    </div>

                    <div className='admin-modal-footer'>
                        <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                        <button className="btn btn-danger" type='submit'>{isEditCase ? 'Update' : 'Save'}</button>
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default ProductionEntryAddUpdateForm;

