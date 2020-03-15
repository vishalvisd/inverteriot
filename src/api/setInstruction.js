import axios from 'axios';
import _ from 'lodash';

const getErrors = (res)=>{
    const errors = [];
    if (_.get(res, 'subscribing.error') === true){
        errors.push(`PubNub channel subscribing error: ${_.get(res, 'subscribing.errorMessage')}`);
    }
    if (_.get(res, 'edgeDeviceApplying.error') === true){
        errors.push(`Edge Device applying error: ${_.get(res, 'edgeDeviceApplying.errorMessage')}`);
    }
    if (_.size(errors) > 0){
        errors.push(`ACK: ${_.get(res, 'ack')}`);
    }
    return errors;
};

const setInstruction = (ins) => {
    //inverteriot_backend/
    //localhost:5000/setinstruction/
    const backendHost = "inverteriot_backend:5000/setinstruction";
    return axios.get(`http://${backendHost}?ins=${ins}`, {
        crossdomain: true
    })
        .then(function (response) {
            return {
                data: _.get(response, 'data'),
                isError: _.get(response, 'data.edgeDeviceApplying.edgeDeviceApplySuccess', false) !== true,
                errors: getErrors(response.data)
            };
        })
        .catch(function (error) {
            console.log(error);
            return {
                data: null,
                isError: true,
                errors: [error]
            };
        });
};

export default setInstruction;