import React from 'react'

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <main className='root'>
        <div className="root-con">
            <div className="content">
                {children}
            </div>
        </div>
    </main>
  )
}

export default RootLayout