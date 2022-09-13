exports.success = function(result){
    return {
        status : 'success',
        result : result
    }
}

exports.errno = function(message){
    return {
        status : 'error',
        message : message
    }
}

