import React from 'react'



type Props = {
    errorMsg: string;
}

const SiteErrorMessage: React.FC<Props> = ({ errorMsg }) => {
    return (
        <div className="fv-plugins-message-container">
            <div className="fv-help-block">
                {errorMsg}
            </div>
        </div>
    )
}

export default SiteErrorMessage;