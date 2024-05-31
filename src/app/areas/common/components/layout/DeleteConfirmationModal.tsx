import React from 'react';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrashCan, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { KTIcon } from '../../../../../_sitecommon/helpers';


const DeleteConfirmationModal = (props: { modalTitle: string, isOpen: boolean; closeModal: any; onDeleteConfirm: any }) => {

    const { modalTitle, isOpen, closeModal, onDeleteConfirm } = props;


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Delete Modal"
            className={"admin-small-modal"}
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>{modalTitle}</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>

                <div className='modal-body py-lg-10 px-lg-10'>

                    <div className="common-delete-alert">
                        <div className="common-delete-alert-icon">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>

                        <div className="text-active-inverse-white bg-active-white active">
                            <h4> Are you sure to delete this record?</h4>
                        </div>
                    </div>

                </div>

                <div className='admin-modal-footer'>
                    <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                    <button className="btn btn-danger" type='button' onClick={(e) => onDeleteConfirm(e)}
                        > 
                        <FontAwesomeIcon   icon={faTrashCan}
                        /> Delete</button>
                </div>

            </div>


        </ReactModal>
    )
}


export default DeleteConfirmationModal