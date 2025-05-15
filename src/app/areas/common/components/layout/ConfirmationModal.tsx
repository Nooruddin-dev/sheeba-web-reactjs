import React from 'react';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { KTIcon } from '../../../../../_sitecommon/helpers';


const ConfirmationModal = (props: { title: string, description: string, confirmLabel: string, cancelLabel: string, isOpen: boolean; closeModal: any; onConfirm: any }) => {

    const { title, description, confirmLabel, cancelLabel, isOpen, closeModal, onConfirm } = props;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className={"admin-small-modal"}>
            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>{title}</h2>
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
                            <h4>{description}</h4>
                        </div>
                    </div>
                </div>

                <div className='admin-modal-footer'>
                    <button className="btn btn-light" type="button" onClick={closeModal}>
                        {cancelLabel}
                    </button>
                    <button className="btn btn-danger" type='button' onClick={(e) => onConfirm(e)}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}


export default ConfirmationModal