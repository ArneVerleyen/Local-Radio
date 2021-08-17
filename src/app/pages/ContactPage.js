import react from 'react';
import './contactPage.scss';
import { Header, Footer } from '../components';

const ContactPage = () => {
    return(
        <div className='contact-page-container'>
            <Header/>
                <div className='contact-text'>
                    <h3>
                        Contact:
                    </h3>
                    <p>e-mail: arneverl@student.arteveldehs.be</p>
                    <p>GSM: 04999999</p>
                    <p>Telefoon: 02345434</p>
                </div>
            <Footer/>
        </div>
    );
}

export default ContactPage;