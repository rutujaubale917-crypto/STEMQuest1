import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            authService.getCurrentUser()
                .then(response => {
                    setUser(response.data)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    setUser(null)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (credentials) => {
        const response = await authService.login(credentials)
        localStorage.setItem('token', response.data.access_token)
        setUser(response.data.user)
        return response
    }

    const register = async (userData) => {
        const response = await authService.register(userData)
        localStorage.setItem('token', response.data.access_token)
        setUser(response.data.user)
        return response
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}