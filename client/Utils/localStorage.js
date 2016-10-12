export const loadFromStorage = (key, {onSuccess, onError} = {}) => {
    try {
        const serialized = localStorage.getItem(key)
        if(serialized === null) {
            if(onSuccess) {
                onSuccess(null)
            }
            return undefined
        }
        const data = JSON.parse(serialized)
        if(onSuccess) {
            onSuccess(data)
        }
        return data
    }
    catch (err) {
        if(onError) {
            onError(err)
        }
    }
}

export const saveToStorage = (key, value, {onSuccess, onError} = {}) => {
    try{
        const serialized = JSON.stringify(value)
        localStorage.setItem(key, serialized)
        if(onSuccess) {
            onSuccess()
        }
    }
    catch(err) {
        if(onError) {
            onError(err)
        }
    }
}
