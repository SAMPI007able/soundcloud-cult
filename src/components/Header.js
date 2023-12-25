import Logo from '../assets/iconsvg/logo.svg';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import useStyles from '../utility/useStyles';

const Header = () => {
    const muiLink = useStyles()
    return (
        <header className='container'>
            <div className='header-logo-nav'>
                {/* Branding Logo */}
                <img src={Logo} className="logo-dim" alt='logo'></img>
                {/* Nav Items */}
                <nav className='header-nav'>
                    <ul>
                        <li>
                            <Link style={muiLink.link} to="/">Home</Link>
                        </li>
                        <li>                            
                            <Link style={muiLink.link} to="/">Albums</Link>
                        </li>
                        <li>
                            <Link style={muiLink.link} to="/">Blogs</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {/* User Profile Icon */}
            <div className='header-user-icon'>
                <Button
                    id="login-button"
                >
                    Login
                </Button>
                <Button
                    id="cart-button"
                >
                    Cart
                </Button>
                </div>
        </header>
    )
}

export default Header;