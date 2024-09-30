/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { createJobCardApi, deletAnyRecordApi, gerProductsListForJobCardBySearchTermApi, getAllUsersApi, getJobCardDetailByIdForEditApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from 'react-select';
import { showErrorMsg, showSuccessMsg, showWarningMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { OrderTaxStatusEnum, sqlDeleteTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { calculateItemsSubTotal, calculateJobCardAmountMaster, calculateTaxValueNewFunc } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import { useNavigate, useParams } from 'react-router';
import { generateUniqueIdWithDate } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { CommonTableActionCell } from '../../common/components/layout/CommonTableActionCell';
import JobCardInvoiceModal from './JobCardInvoiceModal';



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

export default function AddUpdateJobCard(props: { jobCardDetailForEdit: any }) {
    const { jobCardDetailForEdit } = props;


    const navigate = useNavigate();
    const params = useParams();
    const job_card_id = params.job_card_id;

    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, watch, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);




    const [jobCardAllProducts, setJobCardAllProducts] = useState<any>([]);
    const [searchQueryProduct, setSearchQueryProduct] = useState('');
    const [selectedSearchProductOptions, setSelectedSearchProductOptions] = useState([]);
    const [selectedProductDropDown, setSelectedProductDropDown] = useState<any>(null);
    const [jobCardDetailForPrinting, setJobCardDetailForPrinting] = useState<any>(null);

    const [card_tax_type, setCard_tax_type] = useState<any>(null);
    const [card_tax_value, setCard_tax_value] = useState<any>(0);
    const [card_quanity_master_dummy, setCard_quanity_master_dummy] = useState<any>(0);
    const [card_rate_master_dummy, setCard_rate_master_dummy] = useState<any>(0);


    const [latestJobCardId, setLatestJobCardId] = useState<any>(0);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    //--distribution related work
    const [dispatch_place, setDispatch_place] = useState<any>('');
    const [dispatch_weight_quantity, setDispatch_weight_quantity] = useState<any>('');
    const [unique_key, setUnique_key] = useState<any>('');
    const [jobDistributionFields, setJobDistributionFields] = useState<any>([]);

    //--add new case
    const handleAddDispatch = () => {

        if (dispatch_place && dispatch_weight_quantity) {

            //-- edit case
            if (stringIsNullOrWhiteSpace(unique_key) == false) {

                const fieldIndex = jobDistributionFields?.findIndex((field: { unique_key: string; }) => field.unique_key === unique_key);
                if (fieldIndex !== -1) {
                    const updatedFields = [...jobDistributionFields];
                    updatedFields[fieldIndex] = { dispatch_place, dispatch_weight_quantity, unique_key };
                    setJobDistributionFields(updatedFields);

                    setDispatch_place('');
                    setDispatch_weight_quantity('');
                    setUnique_key('');
                }

            } else {

                const isExistsItemAlready = jobDistributionFields?.filter((x: { dispatch_place: any; dispatch_weight_quantity: any; }) => x.dispatch_place == dispatch_place && x.dispatch_weight_quantity == dispatch_weight_quantity)?.length > 0 ? true : false;
                if (isExistsItemAlready === true) {
                    showErrorMsg("Item already exists!")
                } else {
                    const unique_kye_new = generateUniqueIdWithDate();
                    setJobDistributionFields([...jobDistributionFields, { dispatch_place, dispatch_weight_quantity, unique_kye_new }]);
                    setDispatch_place('');
                    setDispatch_weight_quantity('');
                    setUnique_key('');
                }

            }

        } else {
            showErrorMsg("Please select both fields!")
        }
    };

    //--edit case
    const handleEditFieldDispatchPlace = (index: number) => {
        const field = jobDistributionFields[index];


        setDispatch_place(field?.dispatch_place);
        setDispatch_weight_quantity(field?.dispatch_weight_quantity);
        setUnique_key(field?.unique_key);
        //handleDeleteFieldDispatchPlace(index);
    };

    const handleDeleteFieldDispatchPlace = (index: number) => {

        const requiredRow = jobDistributionFields[index];
        if (requiredRow && requiredRow.dispatch_info_id > 0) {
            //--make api call
            const deleteParam = {
                entityName: 'job_card_dispatch_info',
                entityColumnName: 'dispatch_info_id',
                entityRowId: requiredRow.dispatch_info_id,
                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete
            }
            deletAnyRecordApi(deleteParam)
                .then((res: any) => {
                    if (res?.data?.response && res?.data?.response?.success == true && res?.data?.response?.responseMessage == "Deleted Successfully!") {
                        showSuccessMsg("Deleted Successfully!");

                    } else {
                        showErrorMsg("An error occured. Please try again!");
                    }


                })
                .catch((err: any) => {
                    console.error(err, "err");
                    showErrorMsg("An error occured. Please try again!");
                });
        } else {
            showSuccessMsg("Deleted Successfully!");
        }

        const newFields = jobDistributionFields.filter((_: any, i: number) => i !== index);
        setJobDistributionFields(newFields);
        setUnique_key('');



    };





    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }




    const createUpdateJobCard = (data: any) => {
        const { order_date, dispatch_date, company_name, product_name, weight_qty, job_size, micron, sealing_method, job_card_reference, special_request, card_rate, card_amount, card_tax_amount, card_total_amount } = data;


        if (stringIsNullOrWhiteSpace(order_date) || stringIsNullOrWhiteSpace(dispatch_date)
            || stringIsNullOrWhiteSpace(company_name) || stringIsNullOrWhiteSpace(product_name) || stringIsNullOrWhiteSpace(weight_qty)
            || stringIsNullOrWhiteSpace(job_size) || stringIsNullOrWhiteSpace(sealing_method) || stringIsNullOrWhiteSpace(card_rate)) {
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
                job_card_product_id: item.job_card_product_id,
                product_id: item.productid,
                product_code: item?.sku,
                //quantity: item.quantity ?? 1,

            })
        });

        let job_card_dispatch_info_local: any = []
        jobDistributionFields?.forEach((item: any) => {
            job_card_dispatch_info_local.push({
                dispatch_info_id: item.dispatch_info_id,
                dispatch_place: item.dispatch_place,
                dispatch_weight_quantity: item?.dispatch_weight_quantity,
                unique_key: item.unique_key

            })
        });



        let formData = {
            job_card_id: job_card_id,

            order_date: order_date,
            dispatch_date: dispatch_date,
            company_name: company_name,
            product_name: product_name,
            weight_qty: weight_qty,
            job_size: job_size,

            job_card_dispatch_info: job_card_dispatch_info_local,

            micron: micron,
            sealing_method: sealing_method,
            job_card_reference: job_card_reference,
            special_request: special_request,


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

                    //--open the print invoice once saved successfully
                    setTimeout(() => {
                        setIsOpenReceiptModal(true);
                    }, 1000);

                  //  navigate('/job-management/cards-list');

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

        const requiredRow = jobCardAllProducts.find((product: { productid: number; }) => product.productid == productid)
        if (requiredRow && requiredRow.job_card_product_id > 0) {
            //--make api call
            const deleteParam = {
                entityName: 'job_card_products',
                entityColumnName: 'job_card_product_id',
                entityRowId: requiredRow.job_card_product_id,
                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete
            }
            deletAnyRecordApi(deleteParam)
                .then((res: any) => {
                    if (res?.data?.response && res?.data?.response?.success == true && res?.data?.response?.responseMessage == "Deleted Successfully!") {
                        showSuccessMsg("Deleted Successfully!");

                        setJobCardAllProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));



                    } else {
                        showErrorMsg("An error occured. Please try again!");
                    }


                })
                .catch((err: any) => {
                    console.error(err, "err");
                    showErrorMsg("An error occured. Please try again!");
                });
        } else {
            showSuccessMsg("Deleted Successfully!");
            setJobCardAllProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));

        }



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


    //-- Do not add any dependency in array of this useEffect()
    useEffect(() => {

        //-- if edit clone case, then do perform operation in below setTimeout block
        setTimeout(async () => {
            if (jobCardDetailForEdit && jobCardDetailForEdit?.job_card_id > 0) {


                let orderdatelocal = jobCardDetailForEdit.order_date;
                orderdatelocal = orderdatelocal?.split('T')[0];

                let dispatch_date_local = jobCardDetailForEdit.dispatch_date;
                dispatch_date_local = dispatch_date_local?.split('T')[0];

                setValue('order_date', orderdatelocal);
                setValue('dispatch_date', dispatch_date_local);
                setValue('company_name', jobCardDetailForEdit.company_name);
                setValue('product_name', jobCardDetailForEdit.product_name);
                setValue('product_name', jobCardDetailForEdit.product_name);
                setValue('weight_qty', jobCardDetailForEdit.weight_qty);
                setValue('job_size', jobCardDetailForEdit.job_size);
                setValue('micron', jobCardDetailForEdit.micron);
                setValue('sealing_method', jobCardDetailForEdit.sealing_method);
                setValue('job_card_reference', jobCardDetailForEdit.job_card_reference);
                setValue('special_request', jobCardDetailForEdit.special_request);
                setValue('card_rate', jobCardDetailForEdit.card_rate);
                setValue('card_amount', jobCardDetailForEdit.card_amount);
                setValue('card_tax_amount', jobCardDetailForEdit.card_tax_amount);
                setValue('card_total_amount', jobCardDetailForEdit.card_total_amount);

                setCard_tax_type(jobCardDetailForEdit.card_tax_type); //--set tax type
                setCard_tax_value(jobCardDetailForEdit.card_tax_amount); //--set tax value


                // set job card products
                if (jobCardDetailForEdit.job_card_products && jobCardDetailForEdit.job_card_products.length > 0) {
                    try {

                        const jobCardAllProductsLocal: any = [];
                        for (const element of jobCardDetailForEdit.job_card_products) {
                            jobCardAllProductsLocal.push({
                                job_card_product_id: element.job_card_product_id,
                                productid: element.product_id,
                                sku: element?.sku,

                                product_name: element.product_name
                            });
                        }

                        setJobCardAllProducts(jobCardAllProductsLocal);

                    } catch (error) {
                        console.error("Error setting products/materials", error);
                    }
                }


                // set job card dispatch info
                if (jobCardDetailForEdit.job_card_dispatch_info && jobCardDetailForEdit.job_card_dispatch_info.length > 0) {
                    try {

                        const jobDistributionFieldsLocal: any = [];
                        for (const element of jobCardDetailForEdit.job_card_dispatch_info) {
                            jobDistributionFieldsLocal.push({
                                dispatch_info_id: element.dispatch_info_id,
                                dispatch_place: element.dispatch_place,
                                dispatch_weight_quantity: element?.dispatch_weight_quantity,
                                job_card_id: element?.job_card_id,
                                unique_key: element.unique_key
                            });
                        }

                        setJobDistributionFields(jobDistributionFieldsLocal);

                    } catch (error) {
                        console.error("Error setting products/materials", error);
                    }
                }

            }
        }, 500);

    }, []);


    
    //--get job card detail for printing invoice
    useEffect(() => {
        
        const job_card_id_for_api = (job_card_id && parseInt(job_card_id ?? '0') > 0) ? job_card_id :  (latestJobCardId && latestJobCardId > 0  ? latestJobCardId : 0);

        if(job_card_id_for_api && job_card_id_for_api > 0){
            getJobCardDetailByIdForEdit(job_card_id_for_api);
        }
    }, [job_card_id, latestJobCardId]);

    const getJobCardDetailByIdForEdit = (job_card_id_for_api: any) => {

     

        getJobCardDetailByIdForEditApi(job_card_id_for_api)
            .then((res: any) => {

                const { data } = res;
                const dataResponse = data;
                if (dataResponse) {


                    let orderdatelocal = dataResponse.order_date;
                    orderdatelocal = orderdatelocal?.split('T')[0];
    
                    let dispatch_date_local = dataResponse.dispatch_date;
                    dispatch_date_local = dispatch_date_local?.split('T')[0];

                    let finalJobDetail = {
                        order_date: orderdatelocal,
                        dispatch_date: dispatch_date_local,
                        company_name: dataResponse.company_name,
                        product_name: dataResponse.product_name,
                        weight_qty: dataResponse.weight_qty,
                        job_size: dataResponse.job_size,
                        micron: dataResponse.micron,
                        sealing_method: dataResponse.sealing_method,
                        job_card_reference: dataResponse.job_card_reference,
                        special_request: dataResponse.special_request,
                        card_rate: dataResponse.card_rate,
                        card_amount: dataResponse.card_amount,
                        card_tax_amount: dataResponse.card_tax_amount,
                        card_total_amount: dataResponse.card_total_amount,

                        jobCardAllProducts: [],
                        jobDistributionFields: [],
                    }
    
                
    
                    // set job card products
                    if (dataResponse.job_card_products && dataResponse.job_card_products.length > 0) {
                        try {
    
                            const jobCardAllProductsLocal: any = [];
                            for (const element of dataResponse.job_card_products) {
                                jobCardAllProductsLocal.push({
                                    job_card_product_id: element.job_card_product_id,
                                    productid: element.product_id,
                                    sku: element?.sku,
    
                                    product_name: element.product_name
                                });
                            }
    
                           finalJobDetail.jobCardAllProducts = jobCardAllProductsLocal;
    
                        } catch (error) {
                            console.error("Error setting products/materials", error);
                        }
                    }
    
    
                    // set job card dispatch info
                    if (dataResponse.job_card_dispatch_info && dataResponse.job_card_dispatch_info.length > 0) {
                        try {
    
                            const jobDistributionFieldsLocal: any = [];
                            for (const element of dataResponse.job_card_dispatch_info) {
                                jobDistributionFieldsLocal.push({
                                    dispatch_info_id: element.dispatch_info_id,
                                    dispatch_place: element.dispatch_place,
                                    dispatch_weight_quantity: element?.dispatch_weight_quantity,
                                    job_card_id: element?.job_card_id,
                                    unique_key: element.unique_key
                                });
                            }
    
                            finalJobDetail.jobDistributionFields = jobDistributionFieldsLocal;
                          
                        } catch (error) {
                            console.error("Error setting products/materials", error);
                        }
                    }




                    setJobCardDetailForPrinting(finalJobDetail);
                } else {
                    setJobCardDetailForPrinting({});
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (


        <Content>
            <KTCard>



                <KTCardBody className='py-4'>

                    <form ref={formRefOrder}
                        onSubmit={(e) => {
                            handleSubmit(createUpdateJobCard)(e);
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
                                        <label className="form-label required ">Micron</label>
                                        <input
                                            type="number"

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
                                        <label className="form-label ">Tax Amount</label>
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
                                        <label className="form-label  ">Total Rate Amount after Tax</label>
                                        <input
                                            type="number"
                                            min={0}
                                            className={`form-control form-control-solid`}
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


            <div className="card card-xl-stretch mb-5 mb-xl-8 mt-5">
                <div className='card-header border-0'>
                    <h3 className='card-title fw-bold text-gray-900'>Distribution</h3>
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
                    <div className="d-flex mb-3">
                        <div className="me-3">
                            <label htmlFor="fieldName" className="form-label">Dispatch Place</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fieldName"
                                value={dispatch_place}
                                onChange={(e) => setDispatch_place(e.target.value)}
                            />
                        </div>
                        <div className="me-3">
                            <label htmlFor="fieldValue" className="form-label">Weight/Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                id="fieldValue"
                                value={dispatch_weight_quantity}
                                onChange={(e) => setDispatch_weight_quantity(e.target.value)}
                            />
                        </div>


                        <button className="btn btn-info align-self-end" onClick={handleAddDispatch}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} /> Add

                        </button>


                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className='table-responsive'>

                                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                                    <thead>
                                        <tr className='fw-bold text-muted'>

                                            {/* <th className='min-w-80px'>Product Id</th> */}
                                            <th className='min-w-100px'>Dispatch Place</th>
                                            <th className='min-w-80px'>Weight/Quantity</th>

                                            <th className='min-w-50px text-start'>Actions</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            jobDistributionFields != undefined && jobDistributionFields.length > 0
                                                ?
                                                <>
                                                    {jobDistributionFields?.map((dispathItem: any, index: number) => (
                                                        <tr key={index}>


                                                            <td role="cell" className="ps-3">
                                                                <div className='d-flex align-items-center'>

                                                                    <div className='d-flex justify-content-start flex-column'>
                                                                        <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                            {makeAnyStringShortAppenDots(dispathItem?.dispatch_place, 20)}
                                                                        </a>

                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td role="cell" className="">{dispathItem.dispatch_weight_quantity}</td>



                                                            <td className='text-center min-w-50px pe-3'>

                                                                <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                                    onClick={() => handleDeleteFieldDispatchPlace(index)}
                                                                >
                                                                    <i className="ki-duotone ki-trash fs-2">
                                                                        <span className="path1"></span>
                                                                        <span className="path2"></span>
                                                                        <span className="path3"></span>
                                                                        <span className="path4"></span>
                                                                        <span className="path5"></span>
                                                                    </i>
                                                                </a>

                                                                {/* <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2"
                                                                        onClick={(e) => handleEditFieldDispatchPlace(index)}
                                                                    >
                                                                        <i className="ki-duotone ki-pencil fs-2">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </a> */}

                                                            </td>

                                                        </tr>
                                                    ))}


                                                </>
                                                :
                                                <tr>
                                                    <td colSpan={10}>
                                                        <div className='d-flex p-5 justify-content-center align-content-center'>
                                                            <h4 className='text-center'>No dispatch found</h4>
                                                        </div>
                                                    </td>


                                                </tr>
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* <div className="col-lg-12 col-md-12">
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

                            </div> */}
                    </div>





                </div>

            </div>



            <div
                className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover mt-3 bgclor'
                style={{
                   
                    backgroundSize: 'auto 100%',
                    
                }}
            >

                <div className='card-body container-xxl pt-10 pb-8'>

                    <div className=' d-flex align-items-center'>
                        <h1 className='fw-bold me-3'>Search</h1>

                        <span className='fw-bold'>Materials List</span>
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
                                            placeholder="Search material"
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
                    <h3 className='card-title fw-bold text-gray-900'>Selected Materials</h3>
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

                                            {/* <th className='min-w-80px'>Product Id</th> */}
                                            <th className='min-w-100px'>Product Name</th>
                                            <th className='min-w-80px'>Code</th>

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
                                                            {/* <td role="cell" className="ps-3">{productItem.productid}</td> */}


                                                            <td role="cell" className="ps-3">
                                                                <div className='d-flex align-items-center'>

                                                                    <div className='d-flex justify-content-start flex-column'>
                                                                        <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                            {makeAnyStringShortAppenDots(productItem?.product_name, 20)}
                                                                        </a>

                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td role="cell" className="">{productItem.sku}</td>



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
                                {
                                    job_card_id && stringIsNullOrWhiteSpace(job_card_id) == false
                                        ?
                                        <button className="btn btn-primary fs-3 me-3"
                                        onClick={handleOpenCloseOrderReceiptModal}
                                        >
                                            <FontAwesomeIcon icon={faPrint} style={{ marginRight: '4px' }} />

                                            Print
                                        </button>
                                        :
                                        <></>
                                }

                                <button className="btn btn-primary fs-3"
                                    onClick={() => {
                                        if (formRefOrder.current) {
                                            formRefOrder.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} />
                                    {
                                        job_card_id && stringIsNullOrWhiteSpace(job_card_id) == false
                                            ?
                                            'Update'
                                            :
                                            'Save'
                                    }


                                </button>



                            </div>

                        </div>
                    </div>


                </div>

            </div>

            {
                isOpenReceiptModal == true
                    ?

                    <JobCardInvoiceModal
                        isOpen={isOpenReceiptModal}
                        closeModal={handleOpenCloseOrderReceiptModal}
                        jobCardDetailForPrinting={jobCardDetailForPrinting}
                    />
                    :
                    <>
                    </>
            }

        </Content>

    )
}
