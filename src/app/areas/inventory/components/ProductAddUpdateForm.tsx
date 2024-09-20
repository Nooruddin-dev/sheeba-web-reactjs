/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { UnitTypesEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';

interface ProductAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any,
    allUnitsList: any

}





const ProductAddUpdateForm: React.FC<ProductAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,
    allUnitsList

}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);
    const [unitTypeLocal, setUnitTypeLocal] = useState<any>('');
    const [unitSubTypesAll, setUnitSubTypesAll] = useState<any>(
        [
            {
                rowId: 1,
                unit_type: UnitTypesEnum.Roll,
                unit_sub_type: "Micon",
                unit_id: 0,
                unit_value: "",

            },
            {
                rowId: 2,
                unit_type: UnitTypesEnum.Roll,
                unit_sub_type: "Width",
                unit_id: 0,
                unit_value: ""
            },
            {
                rowId: 3,
                unit_type: UnitTypesEnum.Roll,
                unit_sub_type: "Length",
                unit_id: 0,
                unit_value: ""
            },

            // {
            //     rowId: 4,
            //     unit_type: UnitTypesEnum.Roll,
            //     unit_sub_type: "Weight",
            //     unit_id: 0,
            //     unit_value: ""
            // },

            {
                rowId: 5,
                unit_type: UnitTypesEnum.Liquid_Solvent, // For Solvent only. Unit sub type will be empty here
                unit_sub_type: "",
                unit_id: 0,
                unit_value: ""
            },

            {
                rowId: 6,
                unit_type: UnitTypesEnum.Granules, // For Granules only. 
                unit_sub_type: "",
                unit_id: 0,
                unit_value: ""
            }
        ]
    );

    const handleProductUnitValueChange = (rowId: number, event: any) => {
        const { value } = event.target;
    
        setUnitSubTypesAll((prevUnitSubTypes: any) => {
            const updatedUnitSubTypes = [...prevUnitSubTypes];
            const index = updatedUnitSubTypes.findIndex((unitSubType: any) => unitSubType.rowId === rowId);
    
            if (index !== -1) {
                updatedUnitSubTypes[index].unit_value = value;
            }
    
            return updatedUnitSubTypes;
        });
    };



  

    const handleProductUnitIdChange = (rowId: number, event: any) => {
        const { value } = event.target;
    
        setUnitSubTypesAll((prevUnitSubTypes: any) => {
            const updatedUnitSubTypes = [...prevUnitSubTypes];
            const index = updatedUnitSubTypes.findIndex((unitSubType: any) => unitSubType.rowId === rowId);
    
            if (index !== -1) {
                updatedUnitSubTypes[index].unit_id = value;
            }
    
            return updatedUnitSubTypes;
        });
    };




    const onSubmitCategoryForm = (data: any) => {

        // Include unitSubTypesAll in the data sent to the parent


        const formData = { ...data, unitSubTypesAll };
        onSubmit(formData);

        //onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        if (defaultValues && defaultValues.productidEditForm && defaultValues.productidEditForm > 0) {
            setIsEditCase(true);

            if (defaultValues.unit_type && defaultValues.unit_type > 0) {
                setUnitTypeLocal(defaultValues.unit_type);

                const updatedunitSubTypesAll = unitSubTypesAll.map((element: any) => {
                    const selectedElement = defaultValues?.inventory_units_info?.find((x: { unit_sub_type: any; }) => x.unit_sub_type === element.unit_sub_type);

                    return {
                        ...element,
                        unit_value: selectedElement?.unit_value ?? element.unit_value,
                        unit_id: selectedElement?.unit_id ?? element.unit_id,
                    };
                });

                setUnitSubTypesAll(updatedunitSubTypesAll);
            }

        }


    }, [])




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
                        {isEditCase ? 'Update Product' : 'Create Product'}
                    </h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitCategoryForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                        <div className='row'>


                            <input type='hidden' id="productidEditForm" {...register("productidEditForm", { required: false })} />

                            <div className='col-lg-6'>
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

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Short Description</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.short_description ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="short_description" {...register("short_description", { required: false })}
                                        // readOnly={isEditCase}
                                        placeholder="Enter product name"
                                    />
                                    {errors.short_description && <SiteErrorMessage errorMsg='Short description is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  required">SKU</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.sku ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="sku" {...register("sku", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product sku"
                                    />
                                    {errors.sku && <SiteErrorMessage errorMsg='SKU is required' />}
                                </div>
                            </div>



                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Quantity</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.stockquantity ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="stockquantity" {...register("stockquantity", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stockquantity && <SiteErrorMessage errorMsg='Stock quantity is required!' />}
                                </div>
                            </div>

                            
                       

                            {/* <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Cost</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.price ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="price" {...register("price", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product cost"
                                    />
                                    {errors.price && <SiteErrorMessage errorMsg='Cost field is required!' />}
                                </div>
                            </div> */}

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.is_active ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="is_active" {...register("is_active", { required: true })}
                                        disabled={isEditCase}
                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.is_active && <SiteErrorMessage errorMsg='Status is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Inventory Type</label>
                                    <select
                                        className={`form-select form-select-solid `}

                                        aria-label="Select example"
                                        id="unit_type" {...register("unit_type", { required: true })}
                                        disabled={isEditCase}
                                        onChange={(e) => setUnitTypeLocal(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value='1'>Liquid/Solvent</option>
                                        <option value='2'> Granules </option>
                                        <option value='3'>Roll</option>

                                    </select>
                                    {/* {errors.unit_type && <SiteErrorMessage errorMsg='Unit type required' />} */}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Weight Unit Type</label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.weight_unit_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="weight_unit_id" {...register("weight_unit_id", { required: false })}
                                        disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {allUnitsList?.map((item: any, index: any) => (
                                            <option key={index} value={item.unit_id}>
                                                {item.unit_short_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.weight_unit_id && <SiteErrorMessage errorMsg='Weight Unit type is required' />}
                                </div>
                            </div>

                            
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Weight Value</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.weight_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="weight_value" {...register("weight_value", { required: false })}
                                        readOnly={isEditCase}
                                        placeholder="Enter weight"
                                    />
                                    {errors.weight_value && <SiteErrorMessage errorMsg='Weight value is required!' />}
                                </div>
                            </div>



                            {
                                unitTypeLocal == UnitTypesEnum.Roll ?
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <div className='table-responsive'>
                                                <table className='table table-row-dashed table-bordered table-row-gray-300 align-middle gs-0 gy-1'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>

                                                            <th className='min-w-100px ps-3'> Sub Type</th>

                                                            <th className='min-w-100px'>Unit</th>
                                                            <th className='min-w-100px'>Value</th>

                                                        </tr>
                                                    </thead>


                                                    <tbody>
                                                        {unitSubTypesAll?.filter((x: { unit_type: any; }) => x.unit_type === UnitTypesEnum.Roll)?.map((unitSubItem: any, index: number) => (
                                                            <tr key={index}>

                                                                <td role="cell" className="ps-3">{unitSubItem.unit_sub_type}</td>

                                                                <td role="cell" className="">



                                                                    {
                                                                        unitSubItem.unit_sub_type == 'Micon'
                                                                            ?
                                                                            <>
                                                                                {/* <input
                                                                                    type="number"
                                                                                    min={0}
                                                                                    value={unitSubItem.unit_value ?? 0}
                                                                                    className={`form-control form-control-solid`}
                                                                                    readOnly={isEditCase}
                                                                                    placeholder="Enter number"
                                                                                    onChange={(event) => handleProductUnitValueChange(index, event)}
                                                                                /> */}
                                                                            </>

                                                                            :
                                                                            <UnitSelect
                                                                                unit_sub_type={unitSubItem.unit_sub_type}
                                                                                unit_id={unitSubItem.unit_id}
                                                                                allUnitsList={allUnitsList}
                                                                                isEditCase={isEditCase}
                                                                                onChange={(event) => handleProductUnitIdChange(unitSubItem.rowId, event)}

                                                                            />
                                                                    }



                                                                </td>

                                                                <td role="cell">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        value={unitSubItem.unit_value ?? 0}
                                                                        className={`form-control form-control-solid`}
                                                                        readOnly={isEditCase}
                                                                        placeholder="Enter value"
                                                                        onChange={(event) => handleProductUnitValueChange(unitSubItem.rowId, event)}
                                                                    />
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }


                            {/* {
                                unitTypeLocal == UnitTypesEnum.Liquid_Solvent
                                    ?
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <div className='table-responsive'>
                                                <table className='table table-row-dashed table-bordered table-row-gray-300 align-middle gs-0 gy-1'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>


                                                            <th className='min-w-100px'>Unit</th>
                                                            <th className='min-w-100px'>Value</th>

                                                        </tr>
                                                    </thead>


                                                    <tbody>
                                                        {unitSubTypesAll?.filter((x: { unit_type: any; }) => x.unit_type === UnitTypesEnum.Liquid_Solvent).map((unitSubItem: any, index: number) => (
                                                            <tr key={index}>


                                                                <td role="cell" className="">



                                                                    <select
                                                                        className={`form-select form-select-solid`}
                                                                        aria-label="Select example"
                                                                        disabled={isEditCase}
                                                                        value={unitSubItem?.unit_id ?? 0}
                                                                        onChange={(event) => handleProductUnitIdChange(unitSubItem.rowId, event)}
                                                                    >
                                                                        <option value=''>--Select--</option>

                                                                        {allUnitsList?.filter((x: { unit_id: number; }) => x.unit_id == 1 || x.unit_id == 2 || x.unit_id == 3)?.map((item: any, index: any) => (
                                                                            <option key={index} value={item.unit_id}>
                                                                                {item.unit_short_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>



                                                                </td>

                                                                <td role="cell">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        value={unitSubItem.unit_value ?? 0}
                                                                        className={`form-control form-control-solid`}
                                                                        readOnly={isEditCase}
                                                                        placeholder="Enter value"
                                                                        onChange={(event) => handleProductUnitValueChange(unitSubItem.rowId, event)}
                                                                    />
                                                                </td>






                                                            </tr>


                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            } */}

                            {/* {
                                unitTypeLocal == UnitTypesEnum.Granules
                                    ?
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <div className='table-responsive'>
                                                <table className='table table-row-dashed table-bordered table-row-gray-300 align-middle gs-0 gy-1'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>


                                                            <th className='min-w-100px'>Unit</th>
                                                            <th className='min-w-100px'>Value</th>

                                                        </tr>
                                                    </thead>


                                                    <tbody>
                                                        {unitSubTypesAll?.filter((x: { unit_type: any; }) => x.unit_type === UnitTypesEnum.Granules).map((unitSubItem: any, index: number) => (
                                                            <tr key={index}>


                                                                <td role="cell" className="">



                                                                    <select
                                                                        className={`form-select form-select-solid`}
                                                                        aria-label="Select example"
                                                                        disabled={isEditCase}
                                                                        value={unitSubItem?.unit_id ?? 0}
                                                                        onChange={(event) => handleProductUnitIdChange(unitSubItem.rowId, event)}
                                                                    >
                                                                        <option value=''>--Select--</option>

                                                                        {allUnitsList?.filter((x: { unit_id: number; }) => x.unit_id == 1 || x.unit_id == 2)?.map((item: any, index: any) => (
                                                                            <option key={index} value={item.unit_id}>
                                                                                {item.unit_short_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>



                                                                </td>

                                                                <td role="cell">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        value={unitSubItem.unit_value ?? 0}
                                                                        className={`form-control form-control-solid`}
                                                                        readOnly={isEditCase}
                                                                        placeholder="Enter value"
                                                                        onChange={(event) => handleProductUnitValueChange(unitSubItem.rowId, event)}
                                                                    />
                                                                </td>






                                                            </tr>


                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            } */}




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

export default ProductAddUpdateForm;



interface UnitSelectProps {
    unit_sub_type: string;
    unit_id: number;
    allUnitsList: any[]; // Replace with actual type of allUnitsList items
    isEditCase: boolean,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}


const UnitSelect: React.FC<UnitSelectProps> = ({ unit_sub_type, unit_id, allUnitsList, isEditCase, onChange }) => {
    const [unitListSub, setUnitListSub] = useState<any>([]);

    useEffect(() => {
        if (unit_sub_type == 'Width') {
            setUnitListSub(allUnitsList?.filter(x => x.unit_id == 4 || x.unit_id == 5));
        } else if (unit_sub_type == 'Length') {
            setUnitListSub(allUnitsList?.filter(x => x.unit_id == 6));
        } else if (unit_sub_type == 'Weight') {
            setUnitListSub(allUnitsList?.filter(x => x.unit_id == 1 || x.unit_id == 2));
        }

    }, [])

    return (
        <select
            className='form-select form-select-solid'
            value={unit_id ?? 0}
            onChange={onChange}
            disabled={isEditCase}
        >
            <option value="">Select Unit</option>
            {unitListSub.map((item: any, index: number) => (
                <option key={index} value={item.unit_id}>
                    {item.unit_short_name}
                </option>
            ))}
        </select>
    );
};


