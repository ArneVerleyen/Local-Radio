import React from 'react';

const PageLayout = ({children}) => {
    return (
        <div className='page'>
            <main>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;