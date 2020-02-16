import axios from 'axios';

export const register = newUser => {
    return axios
    .post('/signUp', {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password
    })
    .then(response => {
        console.log('User successfully registered')
    })
}

export const login = user => {
    return axios
    .post('/login', {
        email: user.email,
        password: user.password
    })
    .then(response => {
        localStorage.setItem('usertoken', response.data.token)

        return response.data.token
    })
    .catch(err => {
        console.log('User successfully logged in')
    })
}