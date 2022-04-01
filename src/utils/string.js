import _ from "lodash";

export const fillLeftWithToken = (str, total_length, token) => {
    if(token.length !== 1) {
        throw Error('Token must have only 1 character!');
    }

    if(total_length - str.length <= 0) {
        return str
    } else {
        const repeated_token = _.repeat(token, total_length - str.length);
        return `${repeated_token}${str}`
    }
}