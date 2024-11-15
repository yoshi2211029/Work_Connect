import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

const RouterLink = forwardRef(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

// displayNameを追加
RouterLink.displayName = 'RouterLink';

RouterLink.propTypes = {
  href: PropTypes.string,
};

export default RouterLink;
