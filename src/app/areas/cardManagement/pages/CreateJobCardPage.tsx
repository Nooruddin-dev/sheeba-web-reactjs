/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { createJobCardApi, gerProductsListForJobCardBySearchTermApi, getAllUsersApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from 'react-select';
import { showErrorMsg, showSuccessMsg, showWarningMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { OrderTaxStatusEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { calculateItemsSubTotal, calculateJobCardAmountMaster, calculateTaxValueNewFunc } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import { useNavigate } from 'react-router';



const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
    }),
    // input: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
    // singleValue: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
    // placeholder: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
};

export default function CreateJobCardPage() {
    const navigate = useNavigate();
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, watch, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);



    const [jobCardAllProducts, setJobCardAllProducts] = useState<any>([]);
    const [searchQueryProduct, setSearchQueryProduct] = useState('');
    const [selectedSearchProductOptions, setSelectedSearchProductOptions] = useState([]);
    const [selectedProductDropDown, setSelectedProductDropDown] = useState<any>(null);

    const [card_tax_type, setCard_tax_type] = useState<any>(null);
    const [card_tax_value, setCard_tax_value] = useState<any>(0);
    const [card_quanity_master_dummy, setCard_quanity_master_dummy] = useState<any>(0);
    const [card_rate_master_dummy, setCard_rate_master_dummy] = useState<any>(0);


    const [latestJobCardId, setLatestJobCardId] = useState<any>(0);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }




    const createPurchaseOrder = (data: any) => {
        const { order_date, dispatch_date, company_name, product_name, weight_qty, job_size, materials, micron, sealing_method, job_card_reference, special_request, dispatch_place, distribution, card_rate, card_amount, card_tax_amount, card_total_amount } = data;


        if (stringIsNullOrWhiteSpace(order_date) || stringIsNullOrWhiteSpace(dispatch_date)
            || stringIsNullOrWhiteSpace(company_name) || stringIsNullOrWhiteSpace(product_name) || stringIsNullOrWhiteSpace(weight_qty)
            || stringIsNullOrWhiteSpace(job_size) || stringIsNullOrWhiteSpace(materials) || stringIsNullOrWhiteSpace(sealing_method) || stringIsNullOrWhiteSpace(card_rate)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (jobCardAllProducts == undefined || jobCardAllProducts == null || jobCardAllProducts.length < 1) {
            showErrorMsg('Please add produt');
            return false;
        }

        let jobCardAllProductsLocal: any = []



        jobCardAllProducts?.forEach((item: any) => {

            jobCardAllProductsLocal.push({
                product_id: item.productid,
                product_code: item?.sku,
                quantity: item.quantity ?? 1,

            })
        });


        let formData = {
            order_date: order_date,
            dispatch_date: dispatch_date,
            company_name: company_name,
            product_name: product_name,
            weight_qty: weight_qty,
            job_size: job_size,
            materials: materials,
            micron: micron,
            sealing_method: sealing_method,
            job_card_reference: job_card_reference,
            special_request: special_request,
            dispatch_place: dispatch_place,
            distribution: distribution,
            card_rate: card_rate,
            card_amount: card_amount,

            card_tax_type: card_tax_type,
            card_tax_value: card_tax_value,
            card_tax_amount: card_tax_amount,

            card_total_amount: card_total_amount,

            jobCardAllProducts: jobCardAllProductsLocal



        };

        createJobCardApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");

                    setJobCardAllProducts([]);
                    setLatestJobCardId(res?.data?.response?.primaryKeyValue);


                    //setIsOpenReceiptModal(true);

                    //--reset the form using form reset() method
                    reset();
                    setFormSubmitted(false);

                    navigate('/job-management/cards-list');

                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });





    };

    const handleSelectProductDropDown = (selectedOption: any) => {
        // Set the selected customer state

        setSelectedProductDropDown(null);

        const productidSelected = selectedOption?.value;

        const productExists = jobCardAllProducts.some((item: { productid: any; }) => item.productid == productidSelected);
        if (productExists) {
            showWarningMsg('Product already added in the list');
            return false;
        }



        getProductDetailById(productidSelected)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    setJobCardAllProducts((prevCart: any) => [...prevCart, data]);
                }


            })
            .catch((err: any) => console.log(err, "err"));


        // setSelectedCustomerObject(allCustomers?.find((x: { busnPartnerId: any; }) => x.busnPartnerId == selectedOption?.value));
    };

    const handleQuantityChangeJobMaster = (newQuantity: number) => {
        let cardAmountMaster = calculateJobCardAmountMaster(newQuantity, getValues("card_rate"));
        setValue("card_amount", cardAmountMaster);
        setCard_quanity_master_dummy(newQuantity);
    };

    const hanldeCardMasterRateChange = (rate: number) => {

        let quanityLocal = getValues("weight_qty");
        let cardAmountMaster = calculateJobCardAmountMaster(parseFloat(quanityLocal ?? 0), rate);
        setValue("card_amount", cardAmountMaster);
        setCard_rate_master_dummy(rate);
    };


    const handleQuantityChangeItem = (index: number, newQuantity: number) => {
        setJobCardAllProducts((prevCart: any) => {
            const updatedCart = [...prevCart];
            updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
            return updatedCart;
        });
    };



    const removeProductFromCart = (e: any, productid: number) => {
        e.preventDefault();
        setJobCardAllProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));
    };





    // Fetch options when the search query changes
    useEffect(() => {
        if (searchQueryProduct && stringIsNullOrWhiteSpace(searchQueryProduct) == false) {
            gerProductsListBySearchTermService();
        } else {
            setSelectedSearchProductOptions([]); // Clear options if search query is empty
        }
    }, [searchQueryProduct]);


    //--if new user added from form then will pass searchByCustomerId to this funtion
    const gerProductsListBySearchTermService = () => {
        gerProductsListForJobCardBySearchTermApi(searchQueryProduct)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    const customerOptions = res?.data?.map((product: any) => ({
                        value: product.productid,
                        label: `${product.sku} -- ${makeAnyStringShortAppenDots(product.product_name, 40)}`
                    }));
                    setSelectedSearchProductOptions(customerOptions);
                } else {
                    setSelectedSearchProductOptions([]);
                }

            }).catch((error: any) => {
                console.error('Error fetching product data:', error);
            });
    };


    useEffect(() => {

        let card_amount_local = parseFloat(getValues("card_amount") ?? 0);
        let tax_total_amount = calculateTaxValueNewFunc(card_amount_local, card_tax_type, (card_tax_value ?? 0));
        setValue("card_tax_amount", tax_total_amount);
        setValue("card_total_amount", (card_amount_local + tax_total_amount));



    }, [card_tax_type, card_tax_value, card_quanity_master_dummy, card_rate_master_dummy]);

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Create Job'
                pageDescription='Create Job'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <Content>
                <KTCard>



                    <KTCardBody className='py-4'>

                        <form ref={formRefOrder}
                            onSubmit={(e) => {
                                handleSubmit(createPurchaseOrder)(e);
                                setFormSubmitted(true);
                            }}
                        >
                            <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                                <div className='row'>





                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Order Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.order_date ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="order_date" {...register("order_date", { required: true })}

                                                placeholder="Enter order date"
                                            />
                                            {errors.order_date && <SiteErrorMessage errorMsg='Order date is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Dispatch Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.dispatch_date ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="dispatch_date" {...register("dispatch_date", { required: true })}

                                                placeholder="Enter dispath date"
                                            />
                                            {errors.dispatch_date && <SiteErrorMessage errorMsg='Dispath date is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Company Name</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.company_name ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="company_name" {...register("company_name", { required: true })}

                                                placeholder="Enter company name"
                                            />
                                            {errors.company_name && <SiteErrorMessage errorMsg='Company name is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Product Name</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.product_name ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="product_name" {...register("product_name", { required: true })}

                                                placeholder="Enter product name"
                                            />
                                            {errors.product_name && <SiteErrorMessage errorMsg='Product name is required' />}
                                        </div>
                                    </div>



                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Materials</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.materials ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="materials" {...register("materials", { required: true })}

                                                placeholder="Enter material"
                                            />
                                            {errors.materials && <SiteErrorMessage errorMsg='Material is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Micron</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.micron ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="micron" {...register("micron", { required: true })}

                                                placeholder="Enter micron"
                                            />
                                            {errors.micron && <SiteErrorMessage errorMsg='Micron is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Sealing Method</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.sealing_method ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="sealing_method" {...register("sealing_method", { required: true })}

                                                placeholder="Enter sealing method"
                                            />
                                            {errors.sealing_method && <SiteErrorMessage errorMsg='Sealing Method is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Reference</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.job_card_reference ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="job_card_reference" {...register("job_card_reference", { required: true })}

                                                placeholder="Enter reference"
                                            />
                                            {errors.job_card_reference && <SiteErrorMessage errorMsg='Reference is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Special Request</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.special_request ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="special_request" {...register("special_request", { required: true })}

                                                placeholder="Enter special request"
                                            />
                                            {errors.special_request && <SiteErrorMessage errorMsg='Special request is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Dispatch Place</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.dispatch_place ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="dispatch_place" {...register("dispatch_place", { required: true })}

                                                placeholder="Enter dispatch place"
                                            />
                                            {errors.dispatch_place && <SiteErrorMessage errorMsg='Dispatch place is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Distribution</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.distribution ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="distribution" {...register("distribution", { required: true })}

                                                placeholder="Enter distribution"
                                            />
                                            {errors.distribution && <SiteErrorMessage errorMsg='Distribution is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Size</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.job_size ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="job_size" {...register("job_size", { required: true })}

                                                placeholder="Enter size"
                                            />
                                            {errors.job_size && <SiteErrorMessage errorMsg='Size is required' />}
                                        </div>
                                    </div>



                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Weight/Quantity</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.weight_qty ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="weight_qty" {...register("weight_qty", { required: true })}
                                                onChange={(e) => handleQuantityChangeJobMaster(parseInt(e.target.value, 10))}
                                                placeholder="Enter weight/qty"
                                            />
                                            {errors.weight_qty && <SiteErrorMessage errorMsg='Weight/Qty is required' />}
                                        </div>
                                    </div>





                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Rate</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.card_rate ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="card_rate" {...register("card_rate", { required: true })}
                                                onChange={(e) => hanldeCardMasterRateChange(parseFloat(e.target.value))}
                                                placeholder="Enter rate"
                                            />
                                            {errors.card_rate && <SiteErrorMessage errorMsg='Rate is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Amount (Quanity * Rate)</label>
                                            <input
                                                type="number"
                                                min={0}

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.card_amount ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="card_amount" {...register("card_amount", { required: true })}
                                                readOnly={true}
                                                placeholder="Amount (Quantity * Rate)"
                                            />
                                            {/* {errors.card_amount && <SiteErrorMessage errorMsg='Rate is required' />} */}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Tax</label>
                                            {/* <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.tax ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="tax" {...register("tax", { required: true })}

                                                placeholder="Enter tax"
                                            /> */}

                                            <div className="tax-container">
                                                <select
                                                    value={card_tax_type}
                                                    onChange={(e) => setCard_tax_type(e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Percentage">Percentage</option>
                                                    <option value="Fixed">Fixed</option>

                                                </select>
                                                <input
                                                    className='form-control'
                                                    type="number"
                                                    min={0}
                                                    value={card_tax_value || 0}

                                                    onChange={(e) => setCard_tax_value(parseInt(e.target.value, 10))}
                                                    placeholder="Enter tax value"
                                                />
                                            </div>


                                            {errors.tax && <SiteErrorMessage errorMsg='Tax is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Tax Amount</label>
                                            <input
                                                type="number"
                                                min={0}

                                                className={`form-control form-control-solid`}
                                                id="card_tax_amount" {...register("card_tax_amount", { required: true })}
                                                readOnly={true}
                                                placeholder="Tax Amount"
                                            />

                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Total Rate Amount after Tax</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.card_total_amount ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="card_total_amount" {...register("card_total_amount", { required: true })}
                                                readOnly={true}
                                                placeholder="Total Rate Amount after Tax"
                                            />

                                        </div>
                                    </div>





                                </div>

                            </div>

                            {/* <div className='admin-modal-footer'>
                              
                                <button className="btn btn-danger" type='submit'>Create Job</button>
                            </div> */}

                        </form>



                    </KTCardBody>
                </KTCard>





                <div
                    className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover mt-3'
                    style={{
                        backgroundColor: '#663259',
                        backgroundSize: 'auto 100%',
                        backgroundImage: `url('${toAbsoluteUrl('media/misc/taieri.svg')}')`,
                    }}
                >

                    <div className='card-body container-xxl pt-10 pb-8'>

                        <div className=' d-flex align-items-center'>
                            <h1 className='fw-bold me-3 text-white'>Search</h1>

                            <span className='fw-bold text-white opacity-50'>Products List</span>
                        </div>



                        <div className='d-flex flex-column'>

                            <div className='d-lg-flex align-lg-items-center'>

                                <div className='rounded d-flex flex-column flex-lg-row align-items-lg-center bg-body p-5 w-xxl-550px h-lg-60px me-lg-10 my-5'>

                                    <div className='row flex-grow-1 mb-5 mb-lg-0'>

                                        <div className='col-lg-8 d-flex align-items-center mb-3 mb-lg-0'>
                                            <KTIcon iconName='magnifier' className='fs-1 text-gray-500 me-1' />

                                            {/* <input
                                                type='search'
                                                className='form-control form-control-flush flex-grow-1'
                                                name='search'
                                                // value={searchForm.product_name}
                                                // onChange={e => onChange('product_name', e.target.value)}
                                                placeholder='Search Product'
                                            /> */}

                                            <ReactSelect
                                                isMulti={false}
                                                isClearable={true}
                                                placeholder="Search product"
                                                className="flex-grow-1"
                                                styles={customStyles}
                                                value={selectedProductDropDown}
                                                onChange={handleSelectProductDropDown}
                                                options={selectedSearchProductOptions}
                                                onInputChange={setSearchQueryProduct}
                                            />

                                        </div>






                                    </div>





                                </div>


                            </div>

                        </div>

                    </div>

                </div>


                <div className="card card-xl-stretch mb-5 mb-xl-8 mt-5">
                    <div className='card-header border-0'>
                        <h3 className='card-title fw-bold text-gray-900'>Selected Products</h3>
                        <div className='card-toolbar'>
                            {/* begin::Menu */}
                            <button
                                type='button'
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'
                            >
                                <KTIcon iconName='category' className='fs-2' />
                            </button>

                        </div>
                    </div>

                    <div className='card-body pt-0'>

                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className='table-responsive'>

                                    <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                                        <thead>
                                            <tr className='fw-bold text-muted'>

                                                <th className='min-w-80px'>Product Id</th>
                                                <th className='min-w-100px'>Product Name</th>
                                                <th className='min-w-80px'>Code</th>
                                                <th className='min-w-100px'>Quantity</th>
                                                <th className='min-w-50px text-start'>Actions</th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                jobCardAllProducts != undefined && jobCardAllProducts.length > 0
                                                    ?
                                                    <>
                                                        {jobCardAllProducts?.map((productItem: any, index: number) => (
                                                            <tr key={index}>
                                                                <td role="cell" className="ps-3">{productItem.productid}</td>


                                                                <td>
                                                                    <div className='d-flex align-items-center'>

                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                {makeAnyStringShortAppenDots(productItem?.product_name, 20)}
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td role="cell" className="">{productItem.sku}</td>


                                                                <td className='text-end '>
                                                                    <input
                                                                        className='form-select form-select-solid '
                                                                        type="number"
                                                                        min={1}
                                                                        value={productItem.quantity || 1}
                                                                        onChange={(e) => handleQuantityChangeItem(index, parseInt(e.target.value, 10))}

                                                                    />
                                                                </td>







                                                                <td className='text-center min-w-50px pe-3'>
                                                                    <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                                        onClick={(e) => removeProductFromCart(e, productItem?.productid)}
                                                                    >
                                                                        <i className="ki-duotone ki-trash fs-2">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </a>
                                                                </td>

                                                            </tr>
                                                        ))}


                                                    </>
                                                    :
                                                    <tr>
                                                        <td colSpan={10}>
                                                            <div className='d-flex p-5 justify-content-center align-content-center'>
                                                                <h4 className='text-center'>No product found</h4>
                                                            </div>
                                                        </td>


                                                    </tr>
                                            }

                                        </tbody>
                                        {/* {
                                            JobCardAllProducts != undefined && JobCardAllProducts.length > 0
                                                ?
                                                <tfoot className=''>
                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end'></td>
                                                        <td ></td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Sub Total</td>
                                                        <td id="subTotal">{cartItemTotlal}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Tax</td>
                                                        <td className='min-w-250px'>

                                                            <div className='order-tax-box'>
                                                                <div className="tax-container">
                                                                    <select
                                                                        value={orderLevelTaxRateType}
                                                                        onChange={(e) => setOrderLevelTaxRateType(e.target.value)}
                                                                        disabled={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        <option value="Percentage">Percentage</option>
                                                                        <option value="Fixed">Fixed</option>

                                                                    </select>
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        value={orderLevelTaxValue || 0}
                                                                        readOnly={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
                                                                        onChange={(e) => setOrderLevelTaxValue(parseInt(e.target.value, 10))}
                                                                        placeholder="Enter tax value"
                                                                    />
                                                                </div>

                                                                <div className='mt-2'>
                                                                    Total: {calculateTaxValueNewFunc(cartItemTotlal, orderLevelTaxRateType, orderLevelTaxValue)}
                                                                </div>
                                                            </div>








                                                        </td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Total Tax</td>
                                                        <td id="subTotal">{grandTaxAmount}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Grand Total</td>
                                                        <td id="subTotal">{orderTotal}</td>
                                                    </tr>
                                                </tfoot>
                                                :
                                                <>
                                                </>
                                        } */}
                                    </table>

                                </div>

                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-end align-content-center">
                                    <button className="btn btn-primary fs-3"
                                        onClick={() => {
                                            if (formRefOrder.current) {
                                                formRefOrder.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} /> Save
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>

                </div>

                {/* {
                    isOpenReceiptModal == true
                        ?

                        <PurchaseOrderReceiptModal
                            isOpen={isOpenReceiptModal}
                            closeModal={handleOpenCloseOrderReceiptModal}
                            orderId={latestOrderId}
                        />
                        :
                        <>
                        </>
                } */}

            </Content>
        </AdminLayout>
    )
}
