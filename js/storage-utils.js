config = {
    set: function(name, val) {
        __checkStorage()
        var o = JSON.parse(localStorage.getItem(__su_prefix + 'storage-utils'))
        o[name] = val
        localStorage.setItem(__su_prefix + 'storage-utils', JSON.stringify(o))
    },
    get: function(name) {
        __checkStorage()
        o = JSON.parse(localStorage.getItem(__su_prefix + 'storage-utils'))
        return o[name]
    },
    prefix: function(f) {
        __su_prefix = f + '-'
    }
}

function __checkStorage() {
    try {
        __su_prefix
    } catch {
        __su_prefix = ''
    }

    if(localStorage.getItem(__su_prefix + 'storage-utils') === null) {
        localStorage.setItem(__su_prefix + 'storage-utils', '{}')
    }
}