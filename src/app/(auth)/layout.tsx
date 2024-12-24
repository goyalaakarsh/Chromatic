import React from 'react'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <main className='auth'>
        <div className="auth-con">
            <div className="content">
                {children}
            </div>
        </div>
    </main>
  )
}

export default AuthLayout