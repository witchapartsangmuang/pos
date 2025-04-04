import axios from 'axios'
export async function getAll(url: string, params?: any) {
    const data = axios.get(url, {params}).then((response) => {
        return response
    })
    return data
}
export async function getOne(url: string) {
    const data = axios.get(url).then((response) => {
        return response
    })
    return data
}
export async function removeOne(url: string) {
    const data = axios.delete(url).then((response) => {
        return response
    })
    return data
}
export async function removeAll(url: string, key: string[]) {
    const data = axios.delete(url, { data: key }).then((response) => {
        return response
    })
    return data
}
export async function create(url: string, value: object) {
    const data = axios.post(url, value).then((response) => {
        return response
    })
    return data
}
export async function updateOne(url: string, value: object) {
    axios.put(url, value).then((response) => {
        return response
    })
}

export async function updateAll(url: string, arr: object[]) {
    const data = axios.put(url, arr).then((response) => {
        return response
    })
    return data
}