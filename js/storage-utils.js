config = {
    set: function(name, val) {
        var o = JSON.parse(localStorage.getItem('storage-utils'))
        o[name] = val
        localStorage.setItem('storage-utils', JSON.stringify(o))
    },
    get: function(name) {
        o = JSON.parse(localStorage.getItem('storage-utils'))
        return o[name]
    }
}

if(localStorage.getItem('storage-utils') === null) {
    localStorage.setItem('storage-utils', '{}')
}