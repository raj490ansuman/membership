import { Form } from 'antd'
import { FormInstance } from 'antd/lib'
import { createContext, useContext } from 'react'

export const RegistrationCtx = createContext<FormInstance<unknown> | undefined>(undefined)

export const useRegistration = () => useContext(RegistrationCtx)

export const RegistrationProvider = ({ children }) => {
	const [registrationForm] = Form.useForm()

	return <RegistrationCtx.Provider value={registrationForm}>{children}</RegistrationCtx.Provider>
}
